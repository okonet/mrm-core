// @ts-check
'use strict';

const spawnSync = require('child_process').spawnSync;
const castArray = require('lodash/castArray');
const listify = require('listify');
const packageJson = require('./files/packageJson');

/** Install given npm packages if they aren’t installed yet */
function install(deps, options, exec) {
	options = options || {};
	deps = castArray(deps);
	const dev = options.dev !== false;

	const pkg = packageJson({
		dependencies: {},
		devDependencies: {},
	});
	const installed = pkg.get(dev ? 'devDependencies' : 'dependencies') || {};

	const newDeps = deps.filter(dep => !installed[dep]);
	if (newDeps.length === 0) {
		return;
	}

	// eslint-disable-next-line no-console
	console.log(`Installing ${listify(newDeps)}...`);
	runNpm(newDeps, { dev }, exec);
}

/* Uninstall given npm packages */
function uninstall(deps, options, exec) {
	options = options || {};
	deps = castArray(deps);
	const dev = options.dev !== false;

	const pkg = packageJson({
		dependencies: {},
		devDependencies: {},
	});
	const installed = pkg.get(dev ? 'devDependencies' : 'dependencies') || {};

	const newDeps = deps.filter(dep => installed[dep]);

	if (newDeps.length === 0) {
		return;
	}

	// eslint-disable-next-line no-console
	console.log(`Uninstalling ${listify(newDeps)}...`);
	runNpm(newDeps, { remove: true, dev }, exec);
}

/**
 * Install given npm packages
 *
 * @param {Array|string} deps
 * @param {Object} [options]
 * @param {boolean} [options.dev=true] --save-dev (--save by default)
 * @param {boolean} [options.remove=false] uninstall package (install by default)
 * @param {Function} [exec]
 * @return {Object}
 */
function runNpm(deps, options, exec) {
	options = options || {};
	exec = exec || spawnSync;

	const args = [
		options.remove ? 'uninstall' : 'install',
		options.dev ? '--save-dev' : '--save',
	].concat(deps);

	return exec('npm', args, {
		stdio: options.stdio === undefined ? 'inherit' : options.stdio,
		cwd: options.cwd,
	});
}

module.exports = {
	install,
	uninstall,
};
