import { Game } from "./GameState";

const ReplicatedStorage = game.GetService("ReplicatedStorage");

const EMoveCharacter = ReplicatedStorage.WaitForChild("MoveCharacter") as RemoteEvent;
const FFindUnit = ReplicatedStorage.WaitForChild("ClientGetters").WaitForChild("FindUnit") as RemoteFunction;
const FHasMoved = ReplicatedStorage.WaitForChild("ClientGetters").WaitForChild("HasMoved") as RemoteFunction;
const FHasAttacked = ReplicatedStorage.WaitForChild("ClientGetters").WaitForChild("HasAttacked") as RemoteFunction;
const FIsFriendly = ReplicatedStorage.WaitForChild("ClientGetters").WaitForChild("IsFriendly") as RemoteFunction;

EMoveCharacter.OnServerEvent.Connect((_, pos, character) => {
  if (!typeIs(pos, "Vector3") || !typeIs(character, "Instance")) return;

  const obj = Game.units.find(c => c.instance === character)!;

  if (obj.hasMoved) return;

  (obj.instance.FindFirstChild("Humanoid") as Humanoid).MoveTo(pos);
  obj.hasMoved = true;
});

FFindUnit.OnServerInvoke = ((_, model) => {
  if (!typeIs(model, "Instance")) return;

  return Game.units.find(c => c.instance === model)?.instance;
});

FHasMoved.OnServerInvoke = ((_, character) => {
  if (!typeIs(character, "Instance")) return;

  const obj = Game.units.find(c => c.instance === character);

  return obj!.hasMoved;

  // const charState = require(character.FindFirstChild("State") as ModuleScript) as ICharacterModule;
  // return charState.hasMoved;
});

FHasAttacked.OnServerInvoke = ((_, character) => {
  if (!typeIs(character, "Instance")) return;

  const obj = Game.units.find(c => c.instance === character);

  return obj!.hasAttacked;
});

FIsFriendly.OnServerInvoke = ((account, character) => {
  if (!typeIs(character, "Instance")) return;

  const obj = Game.units.find(c => c.instance === character);

  return obj!.owner === account.UserId;
});