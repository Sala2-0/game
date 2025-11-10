import { Game } from "./Game";

const UserInputService = game.GetService("UserInputService");
const RunService = game.GetService("RunService");
const ReplicatedStorage = game.GetService("ReplicatedStorage");

const EMoveCharacter = ReplicatedStorage.WaitForChild("MoveCharacter") as RemoteEvent;
const FHasMoved = ReplicatedStorage.WaitForChild("ClientGetters").WaitForChild("HasMoved") as RemoteFunction;
const FIsFriendly = ReplicatedStorage.WaitForChild("ClientGetters").WaitForChild("IsFriendly") as RemoteFunction<(model: Model) => boolean>;

const player = game.GetService("Players").LocalPlayer;
const cameraPos = game.Workspace.WaitForChild("CameraPos") as Part;
const camera = game.Workspace.CurrentCamera!;
camera.CameraType = Enum.CameraType.Scriptable;

const mouse = player.GetMouse();

if (cameraPos)
  camera.CFrame = cameraPos.CFrame;

let inPlayArea: boolean;
let position: Vector3;

const highlight = ReplicatedStorage.WaitForChild("Assets").WaitForChild("Highlight").Clone() as Part;

// let Game.targetUnit: Character | undefined = undefined;
let pathLineStart: Attachment | undefined = undefined;
const pathLineEnd = highlight.WaitForChild("PathLineEnd") as Attachment;

// let highlightedCharacter: Character | undefined = undefined;

const beam = (ReplicatedStorage.WaitForChild("Assets").WaitForChild("Beam") as Beam).Clone();
beam.Parent = game.Workspace;
beam.Attachment1 = pathLineEnd;

const outline = (ReplicatedStorage.WaitForChild("Assets").WaitForChild("Outline") as Highlight).Clone();

RunService.RenderStepped.Connect(() => {
  const target = mouse.Target;

  position = mouse.Hit.Position;
  highlight.Position = mouse.Hit.Position;

  // Selection
  if (Game.targetUnit === undefined && target?.Parent?.Name === "Character") {
    const targetCharacter = Game.find(target.Parent as Model);
    if (!targetCharacter) return;

    if (!FIsFriendly.InvokeServer(targetCharacter)) return;
    if (FHasMoved.InvokeServer(targetCharacter)) return;

    Game.highlightedUnit = targetCharacter;
    outline.Parent = target.Parent;
  }
  else {
    Game.highlightedUnit = undefined;
    outline.Parent = undefined;
  }

  // Attacking
  if (Game.targetUnit && Game.hasMoved() && Game.hasAttacked()) {
    const humanoid = Game.targetUnit.FindFirstChild("Humanoid") as Humanoid;
    if (!humanoid.MoveToFinished) return;

    const targetOpponent = target?.Parent as Model;
    if (!targetOpponent) return;

    Game.highlightedOpponent = targetOpponent;
    outline.Parent = Game.highlightedOpponent.Parent;
  }

  // Movement
  if (Game.targetUnit && !Game.hasMoved()) {
    if (target && target.GetAttribute("PlayArea")) {
      highlight.Color = Color3.fromHex("#008f9c");
      inPlayArea = true;
      beam.Color = new ColorSequence(Color3.fromHex("#00ffff"));
    }
    else {
      highlight.Color = Color3.fromHex("#9c0003");
      inPlayArea = false;
      beam.Color = new ColorSequence(Color3.fromHex("#9c0003"));
    }
  }
});

UserInputService.InputBegan.Connect((input) => {
  if (input.UserInputType === Enum.UserInputType.MouseButton1) {
    if (inPlayArea && Game.targetUnit) {
      EMoveCharacter.FireServer(position, Game.targetUnit);
      Game.targetUnit = undefined;
      pathLineStart = undefined;
      highlight.Parent = undefined;
      beam.Parent = undefined;
    }

    if (Game.highlightedUnit) {
      Game.targetUnit = Game.highlightedUnit;
      Game.highlightedUnit = undefined;

      pathLineStart = Game.targetUnit.FindFirstChild("PathLineStart") as Attachment;
      beam.Attachment0 = pathLineStart;

      highlight.Parent = game.Workspace;
      beam.Parent = game.Workspace;
    }
  }
});