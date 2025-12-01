import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";

interface HeaderProps {
  onSearch: (query: string) => void;
  showEmptyMessage?: boolean;
}

const Header = ({ onSearch, showEmptyMessage = false }: HeaderProps) => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:h-16 py-4 md:py-0 gap-4 md:gap-0">
          <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                <span className="hidden md:inline">AI Conference Deadlines</span>
                <span className="md:hidden">AI Deadlines</span>
              </span>
            </Link>
            
            <div className="md:hidden">
              <ModeToggle />
            </div>

            <nav className="hidden md:flex space-x-4">
              <Link
                to="/calendar"
                className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
              >
                <CalendarDays className="h-5 w-5" />
                Calendar
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="search"
                placeholder="Search conferences..."
                className="pl-10 w-full"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            <div className="hidden md:block">
              <ModeToggle />
            </div>
          </div>
        </div>
        {showEmptyMessage && (
          <div className="max-w-4xl mx-auto mt-2 mb-0 text-center">
            <p className="text-sm bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 py-2 px-4 rounded-md inline-block">
              There are no upcoming conferences for the selected categories - enable "Show past conferences" to see previous ones
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
