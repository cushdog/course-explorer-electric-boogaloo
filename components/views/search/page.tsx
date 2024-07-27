import AdjustedSelect from "../../ui/adjusted_select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchPage() {

  const semester_options = [
    {value: "fall", label: "Fall"},
    {value: "spring", label: "Spring"},
    {value: "summer", label: "Summer"},
    {value: "winter", label: "Winter"}
  ];

  const year_options = [
    {value: "2021", label: "2021"},
    {value: "2022", label: "2022"},
    {value: "2023", label: "2023"},
    {value: "2024", label: "2024"}
  ];

  return (
    <>
      <Input placeholder="Search for a class..." />
      <AdjustedSelect item_to_select="Select a semester" options={semester_options} />
      <AdjustedSelect item_to_select="Select a year" options={year_options} />
      <Button>Search</Button>
    </>
  );
}
