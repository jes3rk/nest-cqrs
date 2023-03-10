export interface IVoyageLeg {
  beginTime: Date;
  endTime: Date;
  legType: "hotel";
  id: string;
  legTypeId: string;
}

export interface IVoyage {
  createdAt: Date;
  id: string;
  // Assume only one traveler per voyage
  travelerId: string;
  legs: Array<IVoyageLeg>;
}
