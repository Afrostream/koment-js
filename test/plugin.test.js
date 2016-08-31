import QUnit from 'qunit';
import sinon from 'sinon';
import koment from '../src/js/koment';

QUnit.test('the environment is sane', function (assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof koment, 'function', 'koment exists');
});
