// This wrapper was auto-generated.
define(["goog", "box2d.b2Collision"], function (goog, box2d) {

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

goog.provide('box2d.b2CollidePolygon');

goog.require('box2d.b2Collision');

/**
 * Find the separation between poly1 and poly2 for a give edge
 * normal on poly1.
 * @export
 * @return {number}
 * @param {box2d.b2PolygonShape} poly1
 * @param {box2d.b2Transform} xf1
 * @param {number} edge1
 * @param {box2d.b2PolygonShape} poly2
 * @param {box2d.b2Transform} xf2
 */
box2d.b2EdgeSeparation = function (poly1, xf1, edge1, poly2, xf2)
{
	var count1 = poly1.m_count;
	var vertices1 = poly1.m_vertices;
	var normals1 = poly1.m_normals;

	var count2 = poly2.m_count;
	var vertices2 = poly2.m_vertices;

	if (box2d.ENABLE_ASSERTS) { box2d.b2Assert(0 <= edge1 && edge1 < count1); }

	// Convert normal from poly1's frame into poly2's frame.
	var normal1World = box2d.b2MulRV(xf1.q, normals1[edge1], box2d.b2EdgeSeparation.s_normal1World);
	var normal1 = box2d.b2MulTRV(xf2.q, normal1World, box2d.b2EdgeSeparation.s_normal1);

	// Find support vertex on poly2 for -normal.
	var index = 0;
	var minDot = box2d.b2_maxFloat;

	for (var i = 0; i < count2; ++i)
	{
		var dot = box2d.b2DotVV(vertices2[i], normal1);
		if (dot < minDot)
		{
			minDot = dot;
			index = i;
		}
	}

	var v1 = box2d.b2MulXV(xf1, vertices1[edge1], box2d.b2EdgeSeparation.s_v1);
	var v2 = box2d.b2MulXV(xf2, vertices2[index], box2d.b2EdgeSeparation.s_v2);
	var separation = box2d.b2DotVV(box2d.b2SubVV(v2, v1, box2d.b2Vec2.s_t0), normal1World);
	return separation;
}
box2d.b2EdgeSeparation.s_normal1World = new box2d.b2Vec2();
box2d.b2EdgeSeparation.s_normal1 = new box2d.b2Vec2();
box2d.b2EdgeSeparation.s_v1 = new box2d.b2Vec2();
box2d.b2EdgeSeparation.s_v2 = new box2d.b2Vec2();

/**
 * Find the max separation between poly1 and poly2 using edge
 * normals from poly1.
 * @export
 * @return {number}
 * @param {Array.<number>} edgeIndex
 * @param {box2d.b2PolygonShape} poly1
 * @param {box2d.b2Transform} xf1
 * @param {box2d.b2PolygonShape} poly2
 * @param {box2d.b2Transform} xf2
 */
box2d.b2FindMaxSeparation = function (edgeIndex, poly1, xf1, poly2, xf2)
{
	var count1 = poly1.m_count;
	var normals1 = poly1.m_normals;

	// Vector pointing from the centroid of poly1 to the centroid of poly2.
	var d = box2d.b2SubVV(box2d.b2MulXV(xf2, poly2.m_centroid, box2d.b2Vec2.s_t0), box2d.b2MulXV(xf1, poly1.m_centroid, box2d.b2Vec2.s_t1), box2d.b2FindMaxSeparation.s_d);
	var dLocal1 = box2d.b2MulTRV(xf1.q, d, box2d.b2FindMaxSeparation.s_dLocal1);

	// Find edge normal on poly1 that has the largest projection onto d.
	var edge = 0;
	var maxDot = (-box2d.b2_maxFloat);
	for (var i = 0; i < count1; ++i)
	{
		var dot = box2d.b2DotVV(normals1[i], dLocal1);
		if (dot > maxDot)
		{
			maxDot = dot;
			edge = i;
		}
	}

	// Get the separation for the edge normal.
	var s = box2d.b2EdgeSeparation(poly1, xf1, edge, poly2, xf2);

	// Check the separation for the previous edge normal.
	var prevEdge = (edge + count1 - 1) % count1;
	var sPrev = box2d.b2EdgeSeparation(poly1, xf1, prevEdge, poly2, xf2);

	// Check the separation for the next edge normal.
	var nextEdge = (edge + 1) % count1;
	var sNext = box2d.b2EdgeSeparation(poly1, xf1, nextEdge, poly2, xf2);

	// Find the best edge and the search direction.
	var bestEdge = 0;
	var bestSeparation = 0;
	var increment = 0;
	if (sPrev > s && sPrev > sNext)
	{
		increment = -1;
		bestEdge = prevEdge;
		bestSeparation = sPrev;
	}
	else if (sNext > s)
	{
		increment = 1;
		bestEdge = nextEdge;
		bestSeparation = sNext;
	}
	else
	{
		edgeIndex[0] = edge;
		return s;
	}

	// Perform a local search for the best edge normal.
	while (true)
	{
		if (increment == -1)
			edge = (bestEdge + count1 - 1) % count1;
		else
			edge = (bestEdge + 1) % count1;

		s = box2d.b2EdgeSeparation(poly1, xf1, edge, poly2, xf2);

		if (s > bestSeparation)
		{
			bestEdge = edge;
			bestSeparation = s;
		}
		else
		{
			break;
		}
	}

	edgeIndex[0] = bestEdge;
	return bestSeparation;
}
box2d.b2FindMaxSeparation.s_d = new box2d.b2Vec2();
box2d.b2FindMaxSeparation.s_dLocal1 = new box2d.b2Vec2();

/**
 * @export
 * @return {void}
 * @param {Array.<box2d.b2ClipVertex>} c
 * @param {box2d.b2PolygonShape} poly1
 * @param {box2d.b2Transform} xf1
 * @param {number} edge1
 * @param {box2d.b2PolygonShape} poly2
 * @param {box2d.b2Transform} xf2
 */
box2d.b2FindIncidentEdge = function (c, poly1, xf1, edge1, poly2, xf2)
{
	var count1 = poly1.m_count;
	var normals1 = poly1.m_normals;

	var count2 = poly2.m_count;
	var vertices2 = poly2.m_vertices;
	var normals2 = poly2.m_normals;

	if (box2d.ENABLE_ASSERTS) { box2d.b2Assert(0 <= edge1 && edge1 < count1); }

	// Get the normal of the reference edge in poly2's frame.
	var normal1 = box2d.b2MulTRV(xf2.q, box2d.b2MulRV(xf1.q, normals1[edge1], box2d.b2Vec2.s_t0), box2d.b2FindIncidentEdge.s_normal1);

	// Find the incident edge on poly2.
	var index = 0;
	var minDot = box2d.b2_maxFloat;
	for (var i = 0; i < count2; ++i)
	{
		var dot = box2d.b2DotVV(normal1, normals2[i]);
		if (dot < minDot)
		{
			minDot = dot;
			index = i;
		}
	}

	// Build the clip vertices for the incident edge.
	var i1 = index;
	var i2 = (i1 + 1) % count2;

	var c0 = c[0];
	box2d.b2MulXV(xf2, vertices2[i1], c0.v);
	var cf0 = c0.id.cf;
	cf0.indexA = edge1;
	cf0.indexB = i1;
	cf0.typeA = box2d.b2ContactFeatureType.e_face;
	cf0.typeB = box2d.b2ContactFeatureType.e_vertex;

	var c1 = c[1];
	box2d.b2MulXV(xf2, vertices2[i2], c1.v);
	var cf1 = c1.id.cf;
	cf1.indexA = edge1;
	cf1.indexB = i2;
	cf1.typeA = box2d.b2ContactFeatureType.e_face;
	cf1.typeB = box2d.b2ContactFeatureType.e_vertex;
}
box2d.b2FindIncidentEdge.s_normal1 = new box2d.b2Vec2();

/**
 * Find edge normal of max separation on A - return if separating axis is found
 * Find edge normal of max separation on B - return if separation axis is found
 * Choose reference edge as min(minA, minB)
 * Find incident edge
 * Clip
 * The normal points from 1 to 2
 * @export
 * @return {void}
 * @param {box2d.b2Manifold} manifold
 * @param {box2d.b2PolygonShape} polyA
 * @param {box2d.b2Transform} xfA
 * @param {box2d.b2PolygonShape} polyB
 * @param {box2d.b2Transform} xfB
 */
box2d.b2CollidePolygons = function (manifold, polyA, xfA, polyB, xfB)
{
	manifold.pointCount = 0;
	var totalRadius = polyA.m_radius + polyB.m_radius;

	var edgeA = box2d.b2CollidePolygons.s_edgeA; edgeA[0] = 0;
	var separationA = box2d.b2FindMaxSeparation(edgeA, polyA, xfA, polyB, xfB);
	if (separationA > totalRadius)
		return;

	var edgeB = box2d.b2CollidePolygons.s_edgeB; edgeB[0] = 0;
	var separationB = box2d.b2FindMaxSeparation(edgeB, polyB, xfB, polyA, xfA);
	if (separationB > totalRadius)
		return;

	var poly1; // reference polygon
	var poly2; // incident polygon
	var xf1, xf2;
	var edge1 = 0; // reference edge
	var flip = 0;
	var k_relativeTol = 0.98;
	var k_absoluteTol = 0.001;

	if (separationB > k_relativeTol * separationA + k_absoluteTol)
	{
		poly1 = polyB;
		poly2 = polyA;
		xf1 = xfB;
		xf2 = xfA;
		edge1 = edgeB[0];
		manifold.type = box2d.b2ManifoldType.e_faceB;
		flip = 1;
	}
	else
	{
		poly1 = polyA;
		poly2 = polyB;
		xf1 = xfA;
		xf2 = xfB;
		edge1 = edgeA[0];
		manifold.type = box2d.b2ManifoldType.e_faceA;
		flip = 0;
	}

	var incidentEdge = box2d.b2CollidePolygons.s_incidentEdge;
	box2d.b2FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);

	var count1 = poly1.m_count;
	var vertices1 = poly1.m_vertices;

	var iv1 = edge1;
	var iv2 = (edge1 + 1) % count1;

	var local_v11 = vertices1[iv1];
	var local_v12 = vertices1[iv2];

	var localTangent = box2d.b2SubVV(local_v12, local_v11, box2d.b2CollidePolygons.s_localTangent);
	localTangent.Normalize();

	var localNormal = box2d.b2CrossVOne(localTangent, box2d.b2CollidePolygons.s_localNormal);
	var planePoint = box2d.b2MidVV(local_v11, local_v12, box2d.b2CollidePolygons.s_planePoint);

	var tangent = box2d.b2MulRV(xf1.q, localTangent, box2d.b2CollidePolygons.s_tangent);
	var normal = box2d.b2CrossVOne(tangent, box2d.b2CollidePolygons.s_normal);

	var v11 = box2d.b2MulXV(xf1, local_v11, box2d.b2CollidePolygons.s_v11);
	var v12 = box2d.b2MulXV(xf1, local_v12, box2d.b2CollidePolygons.s_v12);

	// Face offset.
	var frontOffset = box2d.b2DotVV(normal, v11);

	// Side offsets, extended by polytope skin thickness.
	var sideOffset1 = -box2d.b2DotVV(tangent, v11) + totalRadius;
	var sideOffset2 = box2d.b2DotVV(tangent, v12) + totalRadius;

	// Clip incident edge against extruded edge1 side edges.
	var clipPoints1 = box2d.b2CollidePolygons.s_clipPoints1;
	var clipPoints2 = box2d.b2CollidePolygons.s_clipPoints2;
	var np;

	// Clip to box side 1
	var ntangent = box2d.b2NegV(tangent, box2d.b2CollidePolygons.s_ntangent);
	np = box2d.b2ClipSegmentToLine(clipPoints1, incidentEdge, ntangent, sideOffset1, iv1);

	if (np < 2)
		return;

	// Clip to negative box side 1
	np = box2d.b2ClipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2, iv2);

	if (np < 2)
	{
		return;
	}

	// Now clipPoints2 contains the clipped points.
	manifold.localNormal.Copy(localNormal);
	manifold.localPoint.Copy(planePoint);

	var pointCount = 0;
	for (var i = 0; i < box2d.b2_maxManifoldPoints; ++i)
	{
		var cv = clipPoints2[i];
		var separation = box2d.b2DotVV(normal, cv.v) - frontOffset;

		if (separation <= totalRadius)
		{
			var cp = manifold.points[pointCount];
			box2d.b2MulTXV(xf2, cv.v, cp.localPoint);
			cp.id.Copy(cv.id);
			if (flip)
			{
				// Swap features
				/** Atype {box2d.b2ContactFeature} */ var cf = cp.id.cf;
				cp.id.cf.indexA = cf.indexB;
				cp.id.cf.indexB = cf.indexA;
				cp.id.cf.typeA = cf.typeB;
				cp.id.cf.typeB = cf.typeA;
			}
			++pointCount;
		}
	}

	manifold.pointCount = pointCount;
}
box2d.b2CollidePolygons.s_incidentEdge = box2d.b2ClipVertex.MakeArray(2);
box2d.b2CollidePolygons.s_clipPoints1 = box2d.b2ClipVertex.MakeArray(2);
box2d.b2CollidePolygons.s_clipPoints2 = box2d.b2ClipVertex.MakeArray(2);
box2d.b2CollidePolygons.s_edgeA = box2d.b2MakeNumberArray(1);
box2d.b2CollidePolygons.s_edgeB = box2d.b2MakeNumberArray(1);
box2d.b2CollidePolygons.s_localTangent = new box2d.b2Vec2();
box2d.b2CollidePolygons.s_localNormal = new box2d.b2Vec2();
box2d.b2CollidePolygons.s_planePoint = new box2d.b2Vec2();
box2d.b2CollidePolygons.s_normal = new box2d.b2Vec2();
box2d.b2CollidePolygons.s_tangent = new box2d.b2Vec2();
box2d.b2CollidePolygons.s_ntangent = new box2d.b2Vec2();
box2d.b2CollidePolygons.s_v11 = new box2d.b2Vec2();
box2d.b2CollidePolygons.s_v12 = new box2d.b2Vec2();

return box2d
})
// End auto-generated code.
