import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CalendarDays, Globe, Tag, Clock, AlarmClock, CalendarPlus } from "lucide-react";
import { Conference } from "@/types/conference";
import { formatDistanceToNow, parseISO, isValid, format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { getDeadlineInLocalTime } from '@/utils/dateUtils';
import { getAllDeadlines, getNextUpcomingDeadline, getUpcomingDeadlines } from '@/utils/deadlineUtils';

interface ConferenceDialogProps {
  conference: Conference;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConferenceDialog = ({ conference, open, onOpenChange }: ConferenceDialogProps) => {
  // Get upcoming deadlines and the next upcoming one
  const upcomingDeadlines = getUpcomingDeadlines(conference);
  const nextDeadline = getNextUpcomingDeadline(conference);
  const deadlineDate = nextDeadline ? getDeadlineInLocalTime(nextDeadline.date, nextDeadline.timezone || conference.timezone) : null;
  
  const [countdown, setCountdown] = useState<string>('');

  // Replace the current location string creation with this more verbose version
  const getLocationString = () => {
    if (conference.venue) {
      return conference.venue;
    }

    const cityCountryArray = [conference.city, conference.country].filter(Boolean);
    const cityCountryString = cityCountryArray.join(", ");
    return cityCountryString || "Location TBD"; // Fallback if everything is empty
  };

  // Use the function result
  const location = getLocationString();

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!deadlineDate || !isValid(deadlineDate)) {
        setCountdown('TBD');
        return;
      }

      const now = new Date();
      const difference = deadlineDate.getTime() - now.getTime();

      if (difference <= 0) {
        setCountdown('Deadline passed');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [deadlineDate]);

  const getCountdownColor = () => {
    if (!deadlineDate || !isValid(deadlineDate)) return "text-muted-foreground";
    const daysRemaining = Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysRemaining <= 7) return "text-red-600";
    if (daysRemaining <= 30) return "text-orange-600";
    return "text-green-600";
  };

  const parseDateFromString = (dateStr: string) => {
    try {
      // Handle formats like "October 19-25, 2025" or "Sept 9-12, 2025"
      const [monthDay, year] = dateStr.split(", ");
      const [month, dayRange] = monthDay.split(" ");
      const [startDay] = dayRange.split("-");
      
      // Construct a date string in a format that can be parsed
      const dateString = `${month} ${startDay} ${year}`;
      const date = parse(dateString, 'MMMM d yyyy', new Date());
      
      if (!isValid(date)) {
        // Try alternative format for abbreviated months
        return parse(dateString, 'MMM d yyyy', new Date());
      }
      
      return date;
    } catch (error) {
      console.error("Error parsing date:", error);
      return new Date();
    }
  };

  const createCalendarEvent = (type: 'google' | 'apple') => {
    try {
      if (!conference.deadline || conference.deadline === 'TBD') {
        throw new Error('No valid deadline found');
      }

      // Parse the deadline date
      const deadlineDate = parseISO(conference.deadline);
      if (!isValid(deadlineDate)) {
        throw new Error('Invalid deadline date');
      }

      // Create an end date 1 hour after the deadline
      const endDate = new Date(deadlineDate.getTime() + (60 * 60 * 1000));

      const formatDateForGoogle = (date: Date) => format(date, "yyyyMMdd'T'HHmmss'Z'");
      const formatDateForApple = (date: Date) => format(date, "yyyyMMdd'T'HHmmss'Z'");

      const title = encodeURIComponent(`${conference.title} deadline`);
      const locationStr = encodeURIComponent(location);
      const description = encodeURIComponent(
        `Paper Submission Deadline for ${conference.full_name || conference.title}\n` +
        (conference.abstract_deadline ? `Abstract Deadline: ${conference.abstract_deadline}\n` : '') +
        `Dates: ${conference.date}\n` +
        `Location: ${location}\n` +
        (conference.link ? `Website: ${conference.link}` : '')
      );

      if (type === 'google') {
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
          `&text=${title}` +
          `&dates=${formatDateForGoogle(deadlineDate)}/${formatDateForGoogle(endDate)}` +
          `&details=${description}` +
          `&location=${locationStr}` +
          `&sprop=website:${encodeURIComponent(conference.link || '')}`;
        window.open(url, '_blank');
      } else {
        const url = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${conference.link || ''}
DTSTART:${formatDateForApple(deadlineDate)}
DTEND:${formatDateForApple(endDate)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${conference.title.toLowerCase().replace(/\s+/g, '-')}-deadline.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error creating calendar event:", error);
      alert("Sorry, there was an error creating the calendar event. Please try again.");
    }
  };

  const generateGoogleMapsUrl = (venue: string | undefined, place: string): string => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue || place)}`;
  };

  const formatDeadlineDisplay = () => {
    if (!deadlineDate || !isValid(deadlineDate)) return null;
    
    const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (
      <div className="text-sm text-muted-foreground">
        <div>{format(deadlineDate, "MMMM d, yyyy 'at' HH:mm:ss")} ({localTZ})</div>
        {conference.timezone && conference.timezone !== localTZ && (
          <div className="text-xs text-muted-foreground/80">
            Conference timezone: {conference.timezone}
          </div>
        )}
      </div>
    );
  };

  // Add these new functions to handle consistent date conversion
  const getLocalDeadline = (dateString: string | undefined) => {
    if (!dateString || dateString === 'TBD') return null;
    return getDeadlineInLocalTime(dateString, conference.timezone);
  };

  // Format any deadline date consistently
  const formatDeadlineDate = (dateString: string | undefined) => {
    if (!dateString || dateString === 'TBD') return dateString || 'TBD';
    
    const localDate = getLocalDeadline(dateString);
    if (!localDate || !isValid(localDate)) return dateString;
    
    const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `${format(localDate, "MMMM d, yyyy")} (${localTZ})`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-md w-full"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {conference.title} {conference.year}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {conference.full_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <CalendarDays className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Dates</p>
                <p className="text-sm text-muted-foreground">{conference.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Globe className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Venue</p>
                <p className="text-sm text-muted-foreground">
                  {conference.venue || [conference.city, conference.country].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="space-y-2 flex-1">
                <p className="font-medium">Important Deadlines</p>
                <div className="text-sm text-muted-foreground space-y-2">
                  {upcomingDeadlines.length > 0 ? (
                    upcomingDeadlines.map((deadline, index) => {
                      const isNext = nextDeadline && deadline.date === nextDeadline.date && deadline.type === nextDeadline.type;
                      return (
                        <div 
                          key={`${deadline.type}-${index}`} 
                          className={`rounded-md p-2 ${isNext ? 'bg-primary/15 border border-primary/30' : 'bg-muted'}`}
                        >
                          <p className={isNext ? 'font-medium text-primary' : ''}>
                            {deadline.label}: {formatDeadlineDate(deadline.date)}
                            {isNext && <span className="ml-2 text-xs">(Next)</span>}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-muted rounded-md p-2">
                      <p>No upcoming deadlines</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <AlarmClock className={`h-5 w-5 mr-3 flex-shrink-0 ${getCountdownColor()}`} />
            <div>
              <span className={`font-medium ${getCountdownColor()}`}>
                {countdown}
              </span>
              {formatDeadlineDisplay()}
            </div>
          </div>

          {Array.isArray(conference.tags) && conference.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {conference.tags.map((tag) => (
                <span key={tag} className="tag">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {conference.note && (
            <div 
              className="text-sm text-muted-foreground mt-2 p-3 bg-muted rounded-lg"
              dangerouslySetInnerHTML={{ 
                __html: conference.note.replace(
                  /<a(.*?)>/g, 
                  '<a$1 style="color: hsl(var(--primary)); font-weight: 500; text-decoration: underline; text-underline-offset: 2px;">'
                ) 
              }}
            />
          )}

          <div className="flex items-center justify-between pt-2">
            {conference.link && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-base text-primary hover:underline p-0"
                asChild
              >
                <a
                  href={conference.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit website
                </a>
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm focus-visible:ring-0 focus:outline-none"
                >
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border border-border" align="end">
                <DropdownMenuItem 
                  className="text-foreground hover:bg-muted"
                  onClick={() => createCalendarEvent('google')}
                >
                  Add to Google Calendar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-foreground hover:bg-muted"
                  onClick={() => createCalendarEvent('apple')}
                >
                  Add to Apple Calendar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConferenceDialog;
