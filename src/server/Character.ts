const ReplicatedStorage = game.GetService("ReplicatedStorage");
const assets = ReplicatedStorage.WaitForChild("Assets") as Folder;

export class Character {
  instance: Model;

  healthPoints: number;
  hasMoved: boolean;
  hasAttacked: boolean;
  owner: number | undefined;

  constructor(accountId: number | undefined, position: CFrame) {
    this.instance = (assets.FindFirstChild("Character") as Model).Clone();

    this.healthPoints = 100;
    this.hasMoved = false;
    this.hasAttacked = false;
    this.owner = accountId;

    this.instance.Parent = game.Workspace;
    this.instance.PivotTo(position);
  }
}

export interface ICharacterModule {
  healthPoints: number;
  hasMoved: boolean;
  hasAttacked: boolean;
  isFriendly: boolean;
}