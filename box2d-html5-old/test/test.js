// This wrapper was auto-generated.
define(["goog", "box2d.Testbed", "requestAnimationFrame"], function (goog, box2d) {

// -removed- goog.provide('main.start');
if (typeof main === "undefined")
    main = {}
if (typeof main.start === "undefined")
    main.start = {}


// -removed- goog.require('box2d.Testbed');
if (typeof box2d.Testbed === "undefined")
    throw new Error("I can haz box2d.Testbed?")


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
	requestAnimationFrame(main.loop);

	main.m_app.SimulationLoop();
}

return main
})
// End auto-generated code.
