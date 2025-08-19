
const hpElement = document.getElementById('hp-display');

 
export function updateHpDisplay(currentHp: number): void {
  if (hpElement) {
   
    const displayHp = Math.max(0, currentHp);
    hpElement.innerText = `HP: ${displayHp}`;
  }
}