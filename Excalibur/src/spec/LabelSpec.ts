﻿/// <reference path="jasmine.d.ts" />
/// <reference path="require.d.ts" />
/// <reference path="Mocks.ts" />

describe('A label', () => {
   var label: ex.Label;
   var engine;
   var scene;
   var mock = new Mocks.Mocker();

   beforeEach(() => {
      label = new ex.Label('Test string', 10, 10);
      scene = new ex.Scene(engine);

      scene.add(label);
      spyOn(scene, 'draw').andCallThrough();
      spyOn(label, 'draw');
		
      engine = mock.engine(100, 100, scene);
   });

   it('should be loaded', () => {
      expect(ex.Label).toBeTruthy();
   });

   it('should be loaded', () => {
      expect(ex.Label).toBeTruthy();
   });

   it('should have text', () => {
      expect(label.text).toBe('Test string');
   });

   it('should default to black', () => {
      expect(label.color.toString()).toBe(ex.Color.Black.toString());
   });

   it('can change color', () => {
      label.color = ex.Color.Blue.clone();

      expect(label.color.toString()).toBe(ex.Color.Blue.toString());

      label.update(engine, 100);
      label.draw(engine.ctx, 100);
      expect(label.color.toString()).toBe(ex.Color.Blue.toString());

   });
});