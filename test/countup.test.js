import Countup from '../index';
import { fire } from 'domassist';
import test from 'tape-rollup';

const DEFAULT_HTML = '<div data-module="Countup" data-module-target="20"></div>';

const init = () => {
  const container = document.createElement('div');
  container.id = 'domodule';
  document.body.appendChild(container);
};

const setup = (html = DEFAULT_HTML) => {
  const container = document.getElementById('domodule');
  container.innerHTML = html;

  return Countup.discover()[0];
};

init();

test('Defaults', assert => {
  const instance = setup();
  assert.equal(instance.options.delay, 0, 'Delay should be 0');
  assert.equal(instance.options.start, 0, 'Start should be 0');
  assert.equal(instance.options.duration, 700, 'Should have a sensible duration');
  assert.equal(instance.options.template, '$D', 'Should have a sensible template');
  assert.end();
});

test('Required', assert => {
  assert.throws(() => {
    setup('<div data-module="Countup"></div>');
  }, /target is required as options for Countup, but is missing!/, 'Should throw if no target defined');

  assert.end();
});

test('Default', assert => {
  const instance = setup();

  assert.equal(instance.el.innerText, '0', 'Should start at 0');
  instance.start();

  setTimeout(() => {
    assert.notEqual(instance.el.innerText, '0', 'Should not be at start');
    assert.notEqual(instance.el.innerText, '20', 'Should not be end');
  }, 200);

  setTimeout(() => {
    assert.equal(instance.el.innerText, '20', 'Should be finished');
    assert.end();
  }, 750);
});

test('Different start', assert => {
  const instance = setup('<div data-module="Countup" data-module-target="20" data-module-start="50"></div>');

  assert.equal(instance.el.innerText, '50', 'Should start at 50');
  instance.start();

  setTimeout(() => {
    assert.notEqual(instance.el.innerText, '50', 'Should not be at start');
    assert.notEqual(instance.el.innerText, '20', 'Should not be end');
  }, 200);

  setTimeout(() => {
    assert.equal(instance.el.innerText, '20', 'Should be finished');
    assert.end();
  }, 750);
});

test('Different duration', assert => {
  const instance = setup('<div data-module="Countup" data-module-target="20" data-module-duration="100"></div>');

  assert.equal(instance.el.innerText, '0', 'Should start at 0');
  instance.start();

  setTimeout(() => {
    assert.equal(instance.el.innerText, '20', 'Should be at end already');
    assert.end();
  }, 200);
});

test('Different template', assert => {
  const instance = setup('<div data-module="Countup" data-module-target="20" data-module-template="$D%"></div>');

  assert.equal(instance.el.innerText, '0%', 'Should start at 0%');
  instance.start();

  setTimeout(() => {
    assert.equal(instance.el.innerText, '20%', 'Should be 20%');
    assert.end();
  }, 750);
});

test('Plays nice with Scroll Triggers', assert => {
  const instance = setup('<div data-module="Countup" data-module-target="20" data-scroll></div>');

  assert.equal(instance.el.innerText, '0', 'Should be 0');

  fire(instance.el, 'scrolltriggers:inView');

  setTimeout(() => {
    assert.equal(instance.el.innerText, '20', 'Should be 20');
    assert.end();
  }, 750);
});
