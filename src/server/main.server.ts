import { Character } from "./Character";
import { Game } from "./GameState";

const ReplicatedStorage = game.GetService("ReplicatedStorage");

const ENewGame = ReplicatedStorage.WaitForChild("NewGame") as RemoteEvent;

ENewGame.OnServerEvent.Connect((account) => {
  const map = game.Workspace.WaitForChild("Map");
  const spawnPositions: Part[] = [];

  for (const i of map.GetChildren())
    if (typeIs(i, "Instance") && i.Name === "SpawnPosition")
      spawnPositions.push(i as Part);

  spawnPositions.forEach((p) => {
    const position = p.CFrame;

    if (!p.GetAttribute("SpawnValue"))
      Game.units.push(new Character(account.UserId, position));
    else
      Game.units.push(new Character(undefined, position));
  });
});