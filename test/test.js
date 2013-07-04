// This wrapper was auto-generated.
define(["goog", "box2d.Testbed"], function (goog, box2d) {

goog.provide('main.start');

goog.require('box2d.Testbed');

/**
 * @export
 * @type {box2d.Testbed.Main}
 */
main.m_app = null;

/**
 * @export
 * @return {void}
 */
main.start = function ()
{
	main.m_app = new box2d.Testbed.Main();

	main.loop();
}

/**
 * @export
 * @return {void}
 */
main.loop = function ()
{
	goog.global.requestAnimFrame(main.loop);

	main.m_app.SimulationLoop();
}

return main
})
// End auto-generated code.
