import SearchPage from "../../components/views/search/page";

export default function Home() {

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
      <SearchPage />
    </>
  );
}
