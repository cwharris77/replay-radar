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
import { useState } from "react";

export default function FilterDropdown() {
  const [selected, setSelected] = useState<string[]>([]);

  const decades = [
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
    setSelected((prev) =>
      prev.includes(decade)
        ? prev.filter((d) => d !== decade)
        : [...prev, decade]
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='lg'>
          <FilterIcon className='mr-2 h-4 w-4' />
          Filters {selected.length > 0 && `(${selected.length})`}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-64 p-4 flex gap-3 flex-wrap max-w-xs flex-col'>
        <h3 className='text-sm font-semibold text-primary mb-2'>Decades</h3>
        <div className='flex flex-wrap gap-2'>
          {decades.map((decade) => (
            <div key={decade} className='flex items-center gap-3'>
              <Checkbox
                id={`decade-${decade}`}
                checked={selected.includes(decade)}
                onCheckedChange={() => toggleDecade(decade)}
              />
              <Label htmlFor={`decade-${decade}`}>{decade}</Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
