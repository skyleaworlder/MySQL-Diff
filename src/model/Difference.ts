import { DifferenceType } from "@/model/Enum";

export class Difference<T> {
  type: DifferenceType;
  tar: T | null;
  src: T | null;

  constructor(type: DifferenceType, target: T | null, source: T | null) {
    this.type = type;
    this.tar = target;
    this.src = source;
  }
}
