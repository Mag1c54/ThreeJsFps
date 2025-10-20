import { FirstPersonControls } from '../utils/controls';

export function setupPointerLock(controls: FirstPersonControls): void {
  const instructions = document.querySelector('#instructions') as HTMLElement;
  const element = document.body;

  if ('pointerLockElement' in document) {
    const pointerlockchange = () => {
      if (document.pointerLockElement === element) {
        controls.enabled = true;
        instructions.style.display = 'none';
      } else {
        controls.enabled = false;
        instructions.style.display = 'flex';
      }
    };

    document.addEventListener('pointerlockchange', pointerlockchange, false);
    instructions.addEventListener('click', () => {
      element.requestPointerLock();
    });
  } else {
    instructions.innerHTML = 'Your browser does not support Pointer Lock';
  }
}