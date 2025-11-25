"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterIcon } from "lucide-react";

interface FilterDropdownProps {
  selectedDecades: string[];
  onChange: (newSelection: string[]) => void;
}

export default function FilterDropdown({
  selectedDecades,
  onChange,
}: FilterDropdownProps) {
  const decades = [
    "All",
    "1950s",
    "1960s",
    "1970s",
    "1980s",
    "1990s",
    "2000s",
    "2010s",
    "2020s",
  ];

  function toggleDecade(decade: string) {
    // If "All" is clicked → select all or clear all
    if (decade === "All") {
      const isAllSelected = selectedDecades.length === decades.length - 1;

      // If all selected → clear everything
      if (isAllSelected) {
        onChange([]);
      } else {
        // Otherwise select all except "All"
        onChange(decades.filter((d) => d !== "All"));
      }

      return;
    }

    // Standard toggle logic for an individual decade
    const newSelection = selectedDecades.includes(decade)
      ? selectedDecades.filter((d) => d !== decade)
      : [...selectedDecades, decade];

    onChange(newSelection);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='lg'>
          <FilterIcon className='mr-2 h-4 w-4' />
          Filters {selectedDecades.length > 0 && `(${selectedDecades.length})`}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='p-4 flex gap-3 flex-wrap max-w-lg flex-col'>
        <div className='flex gap-3 items-center'>
          <h3 className='text-sm font-semibold text-primary'>Decades</h3>
          <Checkbox
            id={`decade-${"All"}`}
            checked={selectedDecades.length === decades.length - 1}
            onCheckedChange={() => toggleDecade("All")}
            className='h-5 w-5 hover:border-primary dark:bg-accent/40'
          />
        </div>
        <div className='flex flex-wrap gap-2'>
          {decades
            .filter((decade) => decade !== "All")
            .map((decade) => (
              <div key={decade} className='flex items-center gap-3'>
                <Checkbox
                  id={`decade-${decade}`}
                  checked={selectedDecades.includes(decade)}
                  onCheckedChange={() => toggleDecade(decade)}
                  className='h-5 w-5 hover:border-primary dark:bg-accent/40'
                />
                <Label htmlFor={`decade-${decade}`}>{decade}</Label>
              </div>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
