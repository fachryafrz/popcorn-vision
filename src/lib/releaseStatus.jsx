export function releaseStatus(status) {
  switch (status) {
    case "Rumored":
      return "Rumored";
    case "Post Production":
      return "Post Production";
    case "In Production":
      return "In Production";
    case "Returning Series":
    case "Planned":
      return "Coming soon";
    default:
      return "Coming soon";
  }
}
