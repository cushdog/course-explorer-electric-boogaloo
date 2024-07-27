import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectDemoProps {
    item_to_select: string;
    options: {value: string, label: string}[];
    selectedValue: string;
    onChange: (value: string) => void;
}

export function AdjustedSelect({ item_to_select, options, selectedValue, onChange } : SelectDemoProps) {
  return (
    <Select value={selectedValue} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={item_to_select} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Options</SelectLabel>
          {options.map((option) => (
            <SelectItem value = {option.value}>
                {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default AdjustedSelect