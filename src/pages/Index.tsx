import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ConferenceCard from "@/components/ConferenceCard";
import conferencesData from "@/utils/conferenceLoader";
import { Conference } from "@/types/conference";
import { useState, useMemo, useEffect } from "react";
import { Switch } from "@/components/ui/switch"
import { parseISO, isValid, isPast } from "date-fns";
import { extractCountry } from "@/utils/countryExtractor";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ChevronRight, Filter, Globe, Calendar, Trophy } from "lucide-react";
import { getAllCountries } from "@/utils/countryExtractor";
import { getDeadlineInLocalTime } from "@/utils/dateUtils";
import { sortConferencesByDeadline, getAllYears, getAllEraRatings } from "@/utils/conferenceUtils";
import { hasUpcomingDeadlines } from "@/utils/deadlineUtils";

const Index = () => {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set());
  const [selectedYears, setSelectedYears] = useState<Set<number>>(new Set());
  const [selectedRatings, setSelectedRatings] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showPastConferences, setShowPastConferences] = useState(false);

  // Category buttons configuration
  const categoryButtons = [
    { id: "machine-learning", label: "Machine Learning" },
    { id: "lifelong-learning", label: "Lifelong Learning" },
    { id: "robotics", label: "Robotics" },
    { id: "computer-vision", label: "Computer Vision" },
    { id: "web-search", label: "Web Search" },
    { id: "data-mining", label: "Data Mining" },
    { id: "natural-language-processing", label: "Natural Language Processing" },
    { id: "signal-processing", label: "Signal Processing" },
    { id: "speech", label: "Speech" },
    { id: "human-computer-interaction", label: "Human Computer Interaction" },
    { id: "computer-graphics", label: "Computer Graphics" },
    { id: "mathematics", label: "Mathematics" },
    { id: "reinforcement-learning", label: "Reinforcement Learning" },
  ];

  const filteredConferences = useMemo(() => {
    if (!Array.isArray(conferencesData)) {
      console.error("Conferences data is not an array:", conferencesData);
      return [];
    }

    const filtered = conferencesData
      .filter((conf: Conference) => {
        // Filter by deadline (past/future) - use new deadline logic
        if (!showPastConferences && !hasUpcomingDeadlines(conf)) return false;

        // Filter by tags
        const matchesTags = selectedTags.size === 0 || 
          (Array.isArray(conf.tags) && conf.tags.some(tag => selectedTags.has(tag)));
        
        // Filter by countries
        const matchesCountry = selectedCountries.size === 0 || 
          (conf.country && selectedCountries.has(conf.country));

        // Filter by years
        const matchesYear = selectedYears.size === 0 || 
          (conf.year && selectedYears.has(conf.year));

        // Filter by ratings
        const matchesRating = selectedRatings.size === 0 || 
          (conf.era_rating && selectedRatings.has(conf.era_rating.toUpperCase()));
        
        // Filter by search query
        const matchesSearch = searchQuery === "" || 
          conf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (conf.full_name && conf.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return matchesTags && matchesCountry && matchesYear && matchesRating && matchesSearch;
      });
    
    // Use the proper sorting function that handles both deadline formats
    return sortConferencesByDeadline(filtered);
  }, [selectedTags, selectedCountries, selectedYears, selectedRatings, searchQuery, showPastConferences]);

  // Update handleTagsChange to handle multiple tags
  const handleTagsChange = (newTags: Set<string>) => {
    setSelectedTags(newTags);
    const searchParams = new URLSearchParams(window.location.search);
    if (newTags.size > 0) {
      searchParams.set('tags', Array.from(newTags).join(','));
    } else {
      searchParams.delete('tags');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
  };

  const handleCountriesChange = (newCountries: Set<string>) => {
    setSelectedCountries(newCountries);
    const searchParams = new URLSearchParams(window.location.search);
    if (newCountries.size > 0) {
      searchParams.set('countries', Array.from(newCountries).join(','));
    } else {
      searchParams.delete('countries');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
  };

  const handleYearsChange = (newYears: Set<number>) => {
    setSelectedYears(newYears);
    const searchParams = new URLSearchParams(window.location.search);
    if (newYears.size > 0) {
      searchParams.set('years', Array.from(newYears).join(','));
    } else {
      searchParams.delete('years');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
  };

  const handleRatingsChange = (newRatings: Set<string>) => {
    setSelectedRatings(newRatings);
    const searchParams = new URLSearchParams(window.location.search);
    if (newRatings.size > 0) {
      searchParams.set('ratings', Array.from(newRatings).join(','));
    } else {
      searchParams.delete('ratings');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
  };

  // Toggle a single tag
  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    handleTagsChange(newTags);
  };

  // Load filters from URL on initial render
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tagsParam = searchParams.get('tags');
    const countriesParam = searchParams.get('countries');
    const yearsParam = searchParams.get('years');
    const ratingsParam = searchParams.get('ratings');
    
    if (tagsParam) {
      const tags = tagsParam.split(',');
      setSelectedTags(new Set(tags));
    }
    
    if (countriesParam) {
      const countries = countriesParam.split(',');
      setSelectedCountries(new Set(countries));
    }

    if (yearsParam) {
      const years = yearsParam.split(',').map(Number).filter(y => !isNaN(y));
      setSelectedYears(new Set(years));
    }

    if (ratingsParam) {
      const ratings = ratingsParam.split(',');
      setSelectedRatings(new Set(ratings));
    }
  }, []);

  // Listen for URL changes from tag clicks in conference cards
  useEffect(() => {
    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const tagsParam = searchParams.get('tags');
      const countriesParam = searchParams.get('countries');
      
      if (tagsParam) {
        const tags = tagsParam.split(',');
        setSelectedTags(new Set(tags));
      } else {
        setSelectedTags(new Set());
      }
      
      if (countriesParam) {
        const countries = countriesParam.split(',');
        setSelectedCountries(new Set(countries));
      } else {
        setSelectedCountries(new Set());
      }
    };

    window.addEventListener('urlchange', handleUrlChange);
    return () => window.removeEventListener('urlchange', handleUrlChange);
  }, []);

  if (!Array.isArray(conferencesData)) {
    return <div>Loading conferences...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearch={setSearchQuery} 
        showEmptyMessage={false}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 py-4">
          {/* Category filter buttons */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {categoryButtons.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedTags.has(category.id) 
                      ? 'bg-primary/15 text-primary hover:bg-primary/20' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  onClick={() => {
                    const newTags = new Set(selectedTags);
                    if (newTags.has(category.id)) {
                      newTags.delete(category.id);
                    } else {
                      newTags.add(category.id);
                    }
                    handleTagsChange(newTags);
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Controls row with past conferences toggle and country filter */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-card border border-border p-2 rounded-md shadow-sm">
              <label htmlFor="show-past" className="text-sm text-muted-foreground">
                Show past conferences
              </label>
              <Switch
                id="show-past"
                checked={showPastConferences}
                onCheckedChange={setShowPastConferences}
              />
            </div>
            
            <div className="flex items-center gap-2 bg-card border border-border p-2 rounded-md shadow-sm flex-wrap">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Globe className="h-4 w-4" />
                    Filter by Country
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 bg-popover border border-border" align="start">
                  <div className="space-y-4">
                    <div>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-foreground">Country</h4>
                      </div>
                      <div 
                        className="max-h-60 overflow-y-auto space-y-2 bg-popover overscroll-contain touch-pan-y" 
                        style={{ WebkitOverflowScrolling: "touch" }}
                      >
                        {getAllCountries(conferencesData as Conference[]).map(country => (
                          <div key={country} className="flex items-center space-x-2 hover:bg-muted/60 p-1 rounded">
                            <Checkbox 
                              id={`country-${country}`}
                              checked={selectedCountries.has(country)}
                              onCheckedChange={() => {
                                const newCountries = new Set(selectedCountries);
                                if (newCountries.has(country)) {
                                  newCountries.delete(country);
                                } else {
                                  newCountries.add(country);
                                }
                                handleCountriesChange(newCountries);
                              }}
                            />
                            <label 
                              htmlFor={`country-${country}`}
                              className="text-sm font-medium text-muted-foreground cursor-pointer w-full py-1"
                            >
                              {country}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Calendar className="h-4 w-4" />
                    Filter by Year
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 bg-popover border border-border" align="start">
                  <div className="space-y-4">
                    <div>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-foreground">Year</h4>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2 bg-popover">
                        {getAllYears(conferencesData as Conference[]).map(year => (
                          <div key={year} className="flex items-center space-x-2 hover:bg-muted/60 p-1 rounded">
                            <Checkbox 
                              id={`year-${year}`}
                              checked={selectedYears.has(year)}
                              onCheckedChange={() => {
                                const newYears = new Set(selectedYears);
                                if (newYears.has(year)) {
                                  newYears.delete(year);
                                } else {
                                  newYears.add(year);
                                }
                                handleYearsChange(newYears);
                              }}
                            />
                            <label 
                              htmlFor={`year-${year}`}
                              className="text-sm font-medium text-muted-foreground cursor-pointer w-full py-1"
                            >
                              {year}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Trophy className="h-4 w-4" />
                    Filter by Rating
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 bg-popover border border-border" align="start">
                  <div className="space-y-4">
                    <div>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-foreground">ERA Rating</h4>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2 bg-popover">
                        {getAllEraRatings(conferencesData as Conference[]).map(rating => (
                          <div key={rating} className="flex items-center space-x-2 hover:bg-muted/60 p-1 rounded">
                            <Checkbox 
                              id={`rating-${rating}`}
                              checked={selectedRatings.has(rating)}
                              onCheckedChange={() => {
                                const newRatings = new Set(selectedRatings);
                                if (newRatings.has(rating)) {
                                  newRatings.delete(rating);
                                } else {
                                  newRatings.add(rating);
                                }
                                handleRatingsChange(newRatings);
                              }}
                            />
                            <label 
                              htmlFor={`rating-${rating}`}
                              className="text-sm font-medium text-muted-foreground cursor-pointer w-full py-1"
                            >
                              {rating}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Display selected countries */}
              {Array.from(selectedCountries).map(country => (
                <button
                  key={country}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/15 text-primary hover:bg-primary/20 font-medium"
                  onClick={() => {
                    const newCountries = new Set(selectedCountries);
                    newCountries.delete(country);
                    handleCountriesChange(newCountries);
                  }}
                >
                  {country}
                  <X className="ml-1 h-3 w-3" />
                </button>
              ))}

              {/* Display selected years */}
              {Array.from(selectedYears).map(year => (
                <button
                  key={year}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/15 text-primary hover:bg-primary/20 font-medium"
                  onClick={() => {
                    const newYears = new Set(selectedYears);
                    newYears.delete(year);
                    handleYearsChange(newYears);
                  }}
                >
                  {year}
                  <X className="ml-1 h-3 w-3" />
                </button>
              ))}

              {/* Display selected ratings */}
              {Array.from(selectedRatings).map(rating => (
                <button
                  key={rating}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/15 text-primary hover:bg-primary/20 font-medium"
                  onClick={() => {
                    const newRatings = new Set(selectedRatings);
                    newRatings.delete(rating);
                    handleRatingsChange(newRatings);
                  }}
                >
                  ERA: {rating}
                  <X className="ml-1 h-3 w-3" />
                </button>
              ))}
              
              {/* Clear all filters button */}
              {(selectedTags.size > 0 || selectedCountries.size > 0 || selectedYears.size > 0 || selectedRatings.size > 0) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    handleTagsChange(new Set());
                    handleCountriesChange(new Set());
                    handleYearsChange(new Set());
                    handleRatingsChange(new Set());
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredConferences.length === 0 && (
          <div className="bg-amber-100/60 dark:bg-amber-900/30 border border-amber-200/70 dark:border-amber-800 text-amber-900 dark:text-amber-100 rounded-md p-4 mb-6">
            <p className="text-center">
              There are no upcoming conferences for the selected categories - enable "Show past conferences" to see previous ones
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConferences.map((conference: Conference) => (
            <ConferenceCard key={conference.id} {...conference} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
