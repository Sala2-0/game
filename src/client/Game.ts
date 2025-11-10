const ReplicatedStorage = game.GetService("ReplicatedStorage");

const FFindUnit = ReplicatedStorage.WaitForChild("ClientGetters").WaitForChild("FindUnit") as RemoteFunction;
const FHasMoved = ReplicatedStorage.WaitForChild("ClientGetters").WaitForChild("HasMoved") as RemoteFunction<(model: Model) => boolean>;
const FHasAttacked = ReplicatedStorage.WaitForChild("ClientGetters").WaitForChild("HasAttacked") as RemoteFunction<(model: Model) => boolean>;

export class Game {
  static highlightedUnit: Model | undefined = undefined;
  static highlightedOpponent: Model | undefined = undefined;

  static targetUnit: Model | undefined = undefined;

  static find = (model: Model): Model | undefined => FFindUnit.InvokeServer(model);
  static hasMoved = (): boolean => this.targetUnit !== undefined && FHasMoved.InvokeServer(this.targetUnit);
  static hasAttacked = (): boolean => this.targetUnit !== undefined && FHasAttacked.InvokeServer(this.targetUnit);
};