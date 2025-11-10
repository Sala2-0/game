import { Game } from "./Game";

const LocalPlayer = game.GetService("Players").LocalPlayer;
const UserInterface = LocalPlayer.WaitForChild("PlayerGui");
const ReplicatedStorage = game.GetService("ReplicatedStorage");

const ENewGame = ReplicatedStorage.WaitForChild("NewGame") as RemoteEvent;

(UserInterface.WaitForChild("Menu").WaitForChild("Start") as TextButton).MouseButton1Click.Connect(() => {
  ENewGame.FireServer();
});