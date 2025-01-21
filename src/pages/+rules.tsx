import { Modal } from '@/components/Modal';

export default function RulesModal() {
  return (
    <Modal>
      <div class="flex flex-col gap-y-4">
        <h1 class="text-center text-3xl">Rules</h1>
        <p>
          To start a game, enter a name in the input field. Then a random countdown between 1 and 6 minutes will start.
          When the timer hits 00:00.000, a name will popup on the middle of the screen, a voice will yell out his/hers
          name, and the screen will go crazy with blinking. If you're the one picked, you are supposed to drink/do a
          shot.
        </p>
        <p>
          Depending on the rules (you should figure it out before starting the timer), the player has to stand while
          drinking, do a shot, or just take a sip of their drink.
        </p>
        <p>
          There are two modes: fair and anarchy. With anarcy, the namepicking is random, which can result in one person
          being chosen n-times in a row. With fair, no player can be more than 3 drinks ahead of the others.
        </p>
        <p>
          To make the game more fun, players can join via phone, by scanning the QR-code, or navigating to the URL
          underneath the QR-code. Here the player can chose their own name, and create a portrait of themselves!
        </p>
        <p>
          To change any of the settings (change from fair to anarchy, or turn of sound), click the "Settings" in the top
          left corner.
        </p>
        <p>
          If a player wants to leave the game/has to leave the party, his or hers name can be removed from the name-pool
          by clicking his or her name on the scoreboard.
        </p>
      </div>
    </Modal>
  );
}
