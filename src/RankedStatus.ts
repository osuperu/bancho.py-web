export enum RankedStatus {
  Inactive = -3,
  Pending = 0,
  Ranked = 2,
  Approved = 3,
  Qualified = 4,
  Loved = 5,
}

export const getRankedStatusString = (status: RankedStatus): string => {
  switch (status) {
    case RankedStatus.Inactive:
      return 'Inactive';
    case RankedStatus.Pending:
      return 'Pending';
    case RankedStatus.Ranked:
      return 'Ranked';
    case RankedStatus.Approved:
      return 'Approved';
    case RankedStatus.Qualified:
      return 'Qualified';
    case RankedStatus.Loved:
      return 'Loved';
    default:
      return 'Unknown';
  }
};
