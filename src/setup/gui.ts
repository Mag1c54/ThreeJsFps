import { GUI } from 'dat.gui';
import { FirstPersonControls } from '../utils/controls';



export function setupGUI(controls: FirstPersonControls): void {
	const gui = new GUI();

    
gui.add(controls, 'MouseMoveSensitivity', 0, 0.01).step(0.0001).name('Mouse Sensitivity');
}