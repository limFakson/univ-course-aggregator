import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';


export const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  selectedUniversity,
  onUniversityChange,
  selectedLocation,
  onLocationChange,
  universities,
  departments,
  onDepartmentChange,
  selectedDepartment,
  locations,
  onClearFilters
}) => {
  const hasActiveFilters = searchTerm || selectedUniversity || selectedDepartment || selectedLocation;

  return (
    <div className="bg-zinc-100 p-6 border rounded-lg mb-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
              Search Courses
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                placeholder="Search by course title or university..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          </div>

          {/* University Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              University
            </label>
            <Select value={selectedUniversity} onValueChange={onUniversityChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Universities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Universities</SelectItem>
                {universities.map((university) => (
                  <SelectItem key={university.id} value={university.name}>
                    {university.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Department
            </label>
            <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Department</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.name}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Location
            </label>
            <Select value={selectedLocation} onValueChange={onLocationChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearFilters}
              className="text-muted-foreground"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};