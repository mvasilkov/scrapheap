// This wrapper was auto-generated.
define(["goog", "box2d.b2Settings", "box2d.b2Contact", "box2d.b2CollideEdge"], function (goog, box2d) {

/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

// -removed- goog.provide('box2d.b2ChainAndCircleContact');
if (typeof box2d === "undefined")
    box2d = {}
if (typeof box2d.b2ChainAndCircleContact === "undefined")
    box2d.b2ChainAndCircleContact = {}


// -removed- goog.require('box2d.b2Settings');
if (typeof box2d.b2Settings === "undefined")
    throw new Error("I can haz box2d.b2Settings?")

// -removed- goog.require('box2d.b2Contact');
if (typeof box2d.b2Contact === "undefined")
    throw new Error("I can haz box2d.b2Contact?")

// -removed- goog.require('box2d.b2CollideEdge');
if (typeof box2d.b2CollideEdge === "undefined")
    throw new Error("I can haz box2d.b2CollideEdge?")


/**
 * @export
 * @constructor
 * @extends {box2d.b2Contact}
 */
box2d.b2ChainAndCircleContact = function ()
{
	goog.base(this); // base class constructor
};

goog.inherits(box2d.b2ChainAndCircleContact, box2d.b2Contact);

/**
 * @export
 * @return {box2d.b2Contact}
 * @param allocator
 */
box2d.b2ChainAndCircleContact.Create = function (allocator)
{
	return new box2d.b2ChainAndCircleContact();
}

/**
 * @export
 * @return {void}
 * @param {box2d.b2Contact} contact
 * @param allocator
 */
box2d.b2ChainAndCircleContact.Destroy = function (contact, allocator)
{
}

/**
 * @export
 * @return {void}
 * @param {box2d.b2Fixture} fixtureA
 * @param {box2d.b2Fixture} fixtureB
 */
box2d.b2ChainAndCircleContact.prototype.Reset = function (fixtureA, indexA, fixtureB, indexB)
{
	goog.base(this, 'Reset', fixtureA, indexA, fixtureB, indexB);
	if (box2d.ENABLE_ASSERTS) { box2d.b2Assert(fixtureA.GetType() == box2d.b2ShapeType.e_chainShape); }
	if (box2d.ENABLE_ASSERTS) { box2d.b2Assert(fixtureB.GetType() == box2d.b2ShapeType.e_circleShape); }
}

/**
 * @export
 * @return {void}
 * @param {box2d.b2Manifold} manifold
 * @param {box2d.b2Transform} xfA
 * @param {box2d.b2Transform} xfB
 */
box2d.b2ChainAndCircleContact.prototype.Evaluate = function (manifold, xfA, xfB)
{
	var shapeA = this.m_fixtureA.GetShape();
	var shapeB = this.m_fixtureB.GetShape();
	if (box2d.ENABLE_ASSERTS) { box2d.b2Assert(shapeA instanceof box2d.b2ChainShape); }
	if (box2d.ENABLE_ASSERTS) { box2d.b2Assert(shapeB instanceof box2d.b2CircleShape); }
	/*box2d.b2ChainShape*/ var chain = (shapeA instanceof box2d.b2ChainShape)? shapeA : null;
	/*box2d.b2EdgeShape*/ var edge = box2d.b2ChainAndCircleContact.prototype.Evaluate.s_edge;
	chain.GetChildEdge(edge, this.m_indexA);
	box2d.b2CollideEdgeAndCircle(
		manifold,
		edge, xfA,
		(shapeB instanceof box2d.b2CircleShape)? shapeB : null, xfB);
}
box2d.b2ChainAndCircleContact.prototype.Evaluate.s_edge = new box2d.b2EdgeShape();

return box2d
})
// End auto-generated code.
