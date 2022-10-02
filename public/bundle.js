var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    function hasContext(key) {
        return get_current_component().$$.context.has(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.50.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function p(e,a=!1){return e=e.slice(e.startsWith("/#")?2:0,e.endsWith("/*")?-2:void 0),e.startsWith("/")||(e="/"+e),e==="/"&&(e=""),a&&!e.endsWith("/")&&(e+="/"),e}function d(e,a){e=p(e,!0),a=p(a,!0);let r=[],n={},t=!0,s=e.split("/").map(o=>o.startsWith(":")?(r.push(o.slice(1)),"([^\\/]+)"):o).join("\\/"),c=a.match(new RegExp(`^${s}$`));return c||(t=!1,c=a.match(new RegExp(`^${s}`))),c?(r.forEach((o,h)=>n[o]=c[h+1]),{exact:t,params:n,part:c[0].slice(0,-1)}):null}function x(e,a,r){if(r==="")return e;if(r[0]==="/")return r;let n=c=>c.split("/").filter(o=>o!==""),t=n(e),s=a?n(a):[];return "/"+s.map((c,o)=>t[o]).join("/")+"/"+r}function m(e,a,r,n){let t=[a,"data-"+a].reduce((s,c)=>{let o=e.getAttribute(c);return r&&e.removeAttribute(c),o===null?s:o},!1);return !n&&t===""?!0:t||n||!1}function S(e){let a=e.split("&").map(r=>r.split("=")).reduce((r,n)=>{let t=n[0];if(!t)return r;let s=n.length>1?n[n.length-1]:!0;return typeof s=="string"&&s.includes(",")&&(s=s.split(",")),r[t]===void 0?r[t]=[s]:r[t].push(s),r},{});return Object.entries(a).reduce((r,n)=>(r[n[0]]=n[1].length>1?n[1]:n[1][0],r),{})}function M(e){return Object.entries(e).map(([a,r])=>r?r===!0?a:`${a}=${Array.isArray(r)?r.join(","):r}`:null).filter(a=>a).join("&")}function w(e,a){return e?a+e:""}function k(e){throw new Error("[Tinro] "+e)}var i={HISTORY:1,HASH:2,MEMORY:3,OFF:4,run(e,a,r,n){return e===this.HISTORY?a&&a():e===this.HASH?r&&r():n&&n()},getDefault(){return !window||window.location.pathname==="srcdoc"?this.MEMORY:this.HISTORY}};var y,$,H,b="",l=E();function E(){let e=i.getDefault(),a,r=c=>window.onhashchange=window.onpopstate=y=null,n=c=>a&&a(R(e)),t=c=>{c&&(e=c),r(),e!==i.OFF&&i.run(e,o=>window.onpopstate=n,o=>window.onhashchange=n)&&n();},s=c=>{let o=Object.assign(R(e),c);return o.path+w(M(o.query),"?")+w(o.hash,"#")};return {mode:t,get:c=>R(e),go(c,o){_(e,c,o),n();},start(c){a=c,t();},stop(){a=null,t(i.OFF);},set(c){this.go(s(c),!c.path);},methods(){return j(this)},base:c=>b=c}}function _(e,a,r){!r&&($=H);let n=t=>history[`${r?"replace":"push"}State`]({},"",t);i.run(e,t=>n(b+a),t=>n(`#${a}`),t=>y=a);}function R(e){let a=window.location,r=i.run(e,t=>(b?a.pathname.replace(b,""):a.pathname)+a.search+a.hash,t=>String(a.hash.slice(1)||"/"),t=>y||"/"),n=r.match(/^([^?#]+)(?:\?([^#]+))?(?:\#(.+))?$/);return H=r,{url:r,from:$,path:n[1]||"",query:S(n[2]||""),hash:n[3]||""}}function j(e){let a=()=>e.get().query,r=c=>e.set({query:c}),n=c=>r(c(a())),t=()=>e.get().hash,s=c=>e.set({hash:c});return {hash:{get:t,set:s,clear:()=>s("")},query:{replace:r,clear:()=>r(""),get(c){return c?a()[c]:a()},set(c,o){n(h=>(h[c]=o,h));},delete(c){n(o=>(o[c]&&delete o[c],o));}}}}var f=T();function T(){let{subscribe:e}=writable(l.get(),a=>{l.start(a);let r=P(l.go);return ()=>{l.stop(),r();}});return {subscribe:e,goto:l.go,params:Q,meta:O,useHashNavigation:a=>l.mode(a?i.HASH:i.HISTORY),mode:{hash:()=>l.mode(i.HASH),history:()=>l.mode(i.HISTORY),memory:()=>l.mode(i.MEMORY)},base:l.base,location:l.methods()}}function P(e){let a=r=>{let n=r.target.closest("a[href]"),t=n&&m(n,"target",!1,"_self"),s=n&&m(n,"tinro-ignore"),c=r.ctrlKey||r.metaKey||r.altKey||r.shiftKey;if(t=="_self"&&!s&&!c&&n){let o=n.getAttribute("href").replace(/^\/#/,"");/^\/\/|^#|^[a-zA-Z]+:/.test(o)||(r.preventDefault(),e(o.startsWith("/")?o:n.href.replace(window.location.origin,"")));}};return addEventListener("click",a),()=>removeEventListener("click",a)}function Q(){return getContext("tinro").meta.params}var g="tinro",K=v({pattern:"",matched:!0});function q(e){let a=getContext(g)||K;(a.exact||a.fallback)&&k(`${e.fallback?"<Route fallback>":`<Route path="${e.path}">`}  can't be inside ${a.fallback?"<Route fallback>":`<Route path="${a.path||"/"}"> with exact path`}`);let r=e.fallback?"fallbacks":"childs",n=writable({}),t=v({fallback:e.fallback,parent:a,update(s){t.exact=!s.path.endsWith("/*"),t.pattern=p(`${t.parent.pattern||""}${s.path}`),t.redirect=s.redirect,t.firstmatch=s.firstmatch,t.breadcrumb=s.breadcrumb,t.match();},register:()=>(t.parent[r].add(t),async()=>{t.parent[r].delete(t),t.parent.activeChilds.delete(t),t.router.un&&t.router.un(),t.parent.match();}),show:()=>{e.onShow(),!t.fallback&&t.parent.activeChilds.add(t);},hide:()=>{e.onHide(),t.parent.activeChilds.delete(t);},match:async()=>{t.matched=!1;let{path:s,url:c,from:o,query:h}=t.router.location,u=d(t.pattern,s);if(!t.fallback&&u&&t.redirect&&(!t.exact||t.exact&&u.exact)){let A=x(s,t.parent.pattern,t.redirect);return f.goto(A,!0)}t.meta=u&&{from:o,url:c,query:h,match:u.part,pattern:t.pattern,breadcrumbs:t.parent.meta&&t.parent.meta.breadcrumbs.slice()||[],params:u.params,subscribe:n.subscribe},t.breadcrumb&&t.meta&&t.meta.breadcrumbs.push({name:t.breadcrumb,path:u.part}),n.set(t.meta),u&&!t.fallback&&(!t.exact||t.exact&&u.exact)&&(!t.parent.firstmatch||!t.parent.matched)?(e.onMeta(t.meta),t.parent.matched=!0,t.show()):t.hide(),u&&t.showFallbacks();}});return setContext(g,t),onMount(()=>t.register()),t}function O(){return hasContext(g)?getContext(g).meta:k("meta() function must be run inside any `<Route>` child component only")}function v(e){let a={router:{},exact:!1,pattern:null,meta:null,parent:null,fallback:!1,redirect:!1,firstmatch:!1,breadcrumb:null,matched:!1,childs:new Set,activeChilds:new Set,fallbacks:new Set,async showFallbacks(){if(!this.fallback&&(await tick(),this.childs.size>0&&this.activeChilds.size==0||this.childs.size==0&&this.fallbacks.size>0)){let r=this;for(;r.fallbacks.size==0;)if(r=r.parent,!r)return;r&&r.fallbacks.forEach(n=>{if(n.redirect){let t=x("/",n.parent.pattern,n.redirect);f.goto(t,!0);}else n.show();});}},start(){this.router.un||(this.router.un=f.subscribe(r=>{this.router.location=r,this.pattern!==null&&this.match();}));},match(){this.showFallbacks();}};return Object.assign(a,e),a.start(),a}

    /* node_modules/tinro/cmp/Route.svelte generated by Svelte v3.50.1 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*params*/ 2,
    	meta: dirty & /*meta*/ 4
    });

    const get_default_slot_context = ctx => ({
    	params: /*params*/ ctx[1],
    	meta: /*meta*/ ctx[2]
    });

    // (33:0) {#if showContent}
    function create_if_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, params, meta*/ 262)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(33:0) {#if showContent}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*showContent*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showContent*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showContent*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = '/*' } = $$props;
    	let { fallback = false } = $$props;
    	let { redirect = false } = $$props;
    	let { firstmatch = false } = $$props;
    	let { breadcrumb = null } = $$props;
    	let showContent = false;
    	let params = {}; /* DEPRECATED */
    	let meta = {};

    	const route = q({
    		fallback,
    		onShow() {
    			$$invalidate(0, showContent = true);
    		},
    		onHide() {
    			$$invalidate(0, showContent = false);
    		},
    		onMeta(newmeta) {
    			$$invalidate(2, meta = newmeta);
    			$$invalidate(1, params = meta.params); /* DEPRECATED */
    		}
    	});

    	const writable_props = ['path', 'fallback', 'redirect', 'firstmatch', 'breadcrumb'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Route> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('path' in $$props) $$invalidate(3, path = $$props.path);
    		if ('fallback' in $$props) $$invalidate(4, fallback = $$props.fallback);
    		if ('redirect' in $$props) $$invalidate(5, redirect = $$props.redirect);
    		if ('firstmatch' in $$props) $$invalidate(6, firstmatch = $$props.firstmatch);
    		if ('breadcrumb' in $$props) $$invalidate(7, breadcrumb = $$props.breadcrumb);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createRouteObject: q,
    		path,
    		fallback,
    		redirect,
    		firstmatch,
    		breadcrumb,
    		showContent,
    		params,
    		meta,
    		route
    	});

    	$$self.$inject_state = $$props => {
    		if ('path' in $$props) $$invalidate(3, path = $$props.path);
    		if ('fallback' in $$props) $$invalidate(4, fallback = $$props.fallback);
    		if ('redirect' in $$props) $$invalidate(5, redirect = $$props.redirect);
    		if ('firstmatch' in $$props) $$invalidate(6, firstmatch = $$props.firstmatch);
    		if ('breadcrumb' in $$props) $$invalidate(7, breadcrumb = $$props.breadcrumb);
    		if ('showContent' in $$props) $$invalidate(0, showContent = $$props.showContent);
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    		if ('meta' in $$props) $$invalidate(2, meta = $$props.meta);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, redirect, firstmatch, breadcrumb*/ 232) {
    			 route.update({ path, redirect, firstmatch, breadcrumb });
    		}
    	};

    	return [
    		showContent,
    		params,
    		meta,
    		path,
    		fallback,
    		redirect,
    		firstmatch,
    		breadcrumb,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			path: 3,
    			fallback: 4,
    			redirect: 5,
    			firstmatch: 6,
    			breadcrumb: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fallback() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fallback(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get redirect() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set redirect(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get firstmatch() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set firstmatch(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get breadcrumb() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set breadcrumb(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* components/user/UserNavbar.svelte generated by Svelte v3.50.1 */
    const file = "components/user/UserNavbar.svelte";

    function create_fragment$1(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let a1;
    	let svg0;
    	let path0;
    	let t1;
    	let a2;
    	let svg1;
    	let path1;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			a1 = element("a");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t1 = space();
    			a2 = element("a");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			if (!src_url_equal(img.src, img_src_value = "/public/nama_logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "navy");
    			attr_dev(img, "height", "60");
    			add_location(img, file, 78, 16, 1485);
    			attr_dev(a0, "href", "/");
    			add_location(a0, file, 77, 12, 1455);
    			attr_dev(div0, "class", "logo-wrap svelte-1tr0jot");
    			add_location(div0, file, 76, 8, 1418);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "d", "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z");
    			add_location(path0, file, 84, 20, 1838);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-width", "1.5");
    			attr_dev(svg0, "stroke", "#15133C");
    			attr_dev(svg0, "width", "18");
    			attr_dev(svg0, "height", "18");
    			add_location(svg0, file, 83, 16, 1685);
    			attr_dev(a1, "class", "menu-select svelte-1tr0jot");
    			attr_dev(a1, "href", "/user/accounts");
    			add_location(a1, file, 82, 12, 1622);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "d", "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0");
    			add_location(path1, file, 89, 20, 2313);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "1.5");
    			attr_dev(svg1, "stroke", "#15133C");
    			attr_dev(svg1, "width", "18");
    			attr_dev(svg1, "height", "18");
    			add_location(svg1, file, 88, 16, 2160);
    			attr_dev(a2, "class", "menu-select svelte-1tr0jot");
    			attr_dev(a2, "href", "/user/notices");
    			add_location(a2, file, 87, 12, 2098);
    			attr_dev(div1, "class", "menu-wrap svelte-1tr0jot");
    			add_location(div1, file, 81, 8, 1585);
    			attr_dev(div2, "class", "navbar svelte-1tr0jot");
    			add_location(div2, file, 75, 4, 1388);
    			attr_dev(div3, "class", "navbar-wrap svelte-1tr0jot");
    			add_location(div3, file, 74, 0, 1357);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, a1);
    			append_dev(a1, svg0);
    			append_dev(svg0, path0);
    			append_dev(div1, t1);
    			append_dev(div1, a2);
    			append_dev(a2, svg1);
    			append_dev(svg1, path1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserNavbar', slots, []);
    	let hover = null;

    	function overHandle(item) {
    		hover = item;
    	}

    	function outHandle() {
    		if (hover) {
    			hover = null;
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserNavbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Route, hover, overHandle, outHandle });

    	$$self.$inject_state = $$props => {
    		if ('hover' in $$props) hover = $$props.hover;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class UserNavbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserNavbar",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* components/manager/ManageNavbar.svelte generated by Svelte v3.50.1 */
    const file$1 = "components/manager/ManageNavbar.svelte";

    function create_fragment$2(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let a1;
    	let t1;
    	let a1_class_value;
    	let t2;
    	let a2;
    	let t3;
    	let a2_class_value;
    	let t4;
    	let a3;
    	let t5;
    	let a3_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			a1 = element("a");
    			t1 = text("기록물 관리");
    			t2 = space();
    			a2 = element("a");
    			t3 = text("헬프데스크");
    			t4 = space();
    			a3 = element("a");
    			t5 = text("회원관리");
    			if (!src_url_equal(img.src, img_src_value = "/public/nama_logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "navy");
    			attr_dev(img, "height", "60");
    			add_location(img, file$1, 86, 16, 1688);
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$1, 85, 12, 1659);
    			attr_dev(div0, "class", "logo-wrap svelte-1asshaf");
    			add_location(div0, file$1, 84, 8, 1623);

    			attr_dev(a1, "class", a1_class_value = "" + (null_to_empty(/*hover*/ ctx[0] == 2
    			? 'menu-select-hover'
    			: 'menu-select') + " svelte-1asshaf"));

    			attr_dev(a1, "href", "/manage/cases");
    			add_location(a1, file$1, 90, 12, 1821);

    			attr_dev(a2, "class", a2_class_value = "" + (null_to_empty(/*hover*/ ctx[0] == 3
    			? 'menu-select-hover'
    			: 'menu-select') + " svelte-1asshaf"));

    			attr_dev(a2, "href", "/manage/help");
    			add_location(a2, file$1, 93, 12, 2018);

    			attr_dev(a3, "class", a3_class_value = "" + (null_to_empty(/*hover*/ ctx[0] == 5
    			? 'menu-select-hover'
    			: 'menu-select') + " svelte-1asshaf"));

    			attr_dev(a3, "href", "/manage/accounts");
    			add_location(a3, file$1, 96, 12, 2213);
    			attr_dev(div1, "class", "menu-wrap svelte-1asshaf");
    			add_location(div1, file$1, 89, 8, 1785);
    			attr_dev(div2, "class", "navbar svelte-1asshaf");
    			add_location(div2, file$1, 83, 4, 1594);
    			attr_dev(div3, "class", "navbar-wrap svelte-1asshaf");
    			add_location(div3, file$1, 82, 0, 1564);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, a1);
    			append_dev(a1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, a2);
    			append_dev(a2, t3);
    			append_dev(div1, t4);
    			append_dev(div1, a3);
    			append_dev(a3, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a1, "mouseover", /*mouseover_handler*/ ctx[3], false, false, false),
    					listen_dev(a1, "mouseout", /*outHandle*/ ctx[2], false, false, false),
    					listen_dev(a2, "mouseover", /*mouseover_handler_1*/ ctx[4], false, false, false),
    					listen_dev(a2, "mouseout", /*outHandle*/ ctx[2], false, false, false),
    					listen_dev(a3, "mouseover", /*mouseover_handler_2*/ ctx[5], false, false, false),
    					listen_dev(a3, "mouseout", /*outHandle*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*hover*/ 1 && a1_class_value !== (a1_class_value = "" + (null_to_empty(/*hover*/ ctx[0] == 2
    			? 'menu-select-hover'
    			: 'menu-select') + " svelte-1asshaf"))) {
    				attr_dev(a1, "class", a1_class_value);
    			}

    			if (dirty & /*hover*/ 1 && a2_class_value !== (a2_class_value = "" + (null_to_empty(/*hover*/ ctx[0] == 3
    			? 'menu-select-hover'
    			: 'menu-select') + " svelte-1asshaf"))) {
    				attr_dev(a2, "class", a2_class_value);
    			}

    			if (dirty & /*hover*/ 1 && a3_class_value !== (a3_class_value = "" + (null_to_empty(/*hover*/ ctx[0] == 5
    			? 'menu-select-hover'
    			: 'menu-select') + " svelte-1asshaf"))) {
    				attr_dev(a3, "class", a3_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ManageNavbar', slots, []);
    	let hover = null;

    	function overHandle(item) {
    		$$invalidate(0, hover = item);
    	}

    	function outHandle() {
    		if (hover) {
    			$$invalidate(0, hover = null);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ManageNavbar> was created with unknown prop '${key}'`);
    	});

    	const mouseover_handler = () => overHandle(2);
    	const mouseover_handler_1 = () => overHandle(3);
    	const mouseover_handler_2 = () => overHandle(5);
    	$$self.$capture_state = () => ({ Route, hover, overHandle, outHandle });

    	$$self.$inject_state = $$props => {
    		if ('hover' in $$props) $$invalidate(0, hover = $$props.hover);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hover,
    		overHandle,
    		outHandle,
    		mouseover_handler,
    		mouseover_handler_1,
    		mouseover_handler_2
    	];
    }

    class ManageNavbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ManageNavbar",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* components/Footer.svelte generated by Svelte v3.50.1 */

    const file$2 = "components/Footer.svelte";

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;
    	let h3;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Copyright by © 2022 해군사관학교 학술정보원";
    			attr_dev(h3, "class", "copyright svelte-q8ffqf");
    			add_location(h3, file$2, 40, 8, 716);
    			attr_dev(div0, "class", "footer svelte-q8ffqf");
    			add_location(div0, file$2, 39, 4, 687);
    			attr_dev(div1, "class", "footer-wrap svelte-q8ffqf");
    			add_location(div1, file$2, 38, 0, 657);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quadIn(t) {
        return t * t;
    }
    function quintIn(t) {
        return t * t * t * t * t;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }
    function draw(node, { delay = 0, speed, duration, easing = cubicInOut } = {}) {
        let len = node.getTotalLength();
        const style = getComputedStyle(node);
        if (style.strokeLinecap !== 'butt') {
            len += parseInt(style.strokeWidth);
        }
        if (duration === undefined) {
            if (speed === undefined) {
                duration = 800;
            }
            else {
                duration = len / speed;
            }
        }
        else if (typeof duration === 'function') {
            duration = duration(len);
        }
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `stroke-dasharray: ${t * len} ${u * len}`
        };
    }
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, {
                    rect: node.getBoundingClientRect()
                });
                return () => {
                    if (counterparts.has(params.key)) {
                        const { rect } = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(rect, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* components/user/UserSearch.svelte generated by Svelte v3.50.1 */

    const { console: console_1 } = globals;
    const file$3 = "components/user/UserSearch.svelte";

    // (138:12) {:else}
    function create_else_block(ctx) {
    	let label;
    	let h3;
    	let label_intro;
    	let label_outro;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			h3 = element("h3");
    			h3.textContent = "제목, 이름 또는 장소를 검색해보세요";
    			attr_dev(h3, "class", "svelte-1qpfvfi");
    			add_location(h3, file$3, 143, 27, 3443);
    			attr_dev(label, "for", "search-input");
    			attr_dev(label, "class", "search-label svelte-1qpfvfi");
    			add_location(label, file$3, 139, 20, 3200);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, h3);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(label, "click", labelHandle, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (label_outro) label_outro.end(1);
    				label_intro = create_in_transition(label, /*receive*/ ctx[3], { key: 'unfocused' });
    				label_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (label_intro) label_intro.invalidate();
    			label_outro = create_out_transition(label, /*send*/ ctx[2], { key: 'focused' });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching && label_outro) label_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(138:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (130:12) {#if focused || search_value}
    function create_if_block$1(ctx) {
    	let label;
    	let h3;
    	let label_intro;
    	let label_outro;
    	let current;

    	const block = {
    		c: function create() {
    			label = element("label");
    			h3 = element("h3");
    			h3.textContent = "제목, 이름 또는 장소를 검색해보세요";
    			attr_dev(h3, "class", "svelte-1qpfvfi");
    			add_location(h3, file$3, 134, 27, 3038);
    			attr_dev(label, "for", "search-input");
    			attr_dev(label, "class", "search-label-focused svelte-1qpfvfi");
    			add_location(label, file$3, 131, 20, 2838);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, h3);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (label_outro) label_outro.end(1);
    				label_intro = create_in_transition(label, /*receive*/ ctx[3], { key: 'focused' });
    				label_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (label_intro) label_intro.invalidate();
    			label_outro = create_out_transition(label, /*send*/ ctx[2], { key: 'unfocused' });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching && label_outro) label_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(130:12) {#if focused || search_value}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let form;
    	let input;
    	let t0;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let button;
    	let span;
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*focused*/ ctx[0] || /*search_value*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			form = element("form");
    			input = element("input");
    			t0 = space();
    			if_block.c();
    			t1 = space();
    			button = element("button");
    			span = element("span");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(input, "class", "search-input svelte-1qpfvfi");
    			attr_dev(input, "type", "text");
    			add_location(input, file$3, 128, 8, 2628);
    			attr_dev(path, "d", "M10.5 0C11.0052 0 11.4922 0.0651042 11.9609 0.195312C12.4297 0.325521 12.8672 0.510417 13.2734 0.75C13.6797 0.989583 14.0495 1.27865 14.3828 1.61719C14.7214 1.95052 15.0104 2.32031 15.25 2.72656C15.4896 3.13281 15.6745 3.57031 15.8047 4.03906C15.9349 4.50781 16 4.99479 16 5.5C16 6.00521 15.9349 6.49219 15.8047 6.96094C15.6745 7.42969 15.4896 7.86719 15.25 8.27344C15.0104 8.67969 14.7214 9.05208 14.3828 9.39062C14.0495 9.72396 13.6797 10.0104 13.2734 10.25C12.8672 10.4896 12.4297 10.6745 11.9609 10.8047C11.4922 10.9349 11.0052 11 10.5 11C9.84896 11 9.22396 10.8906 8.625 10.6719C8.03125 10.4531 7.48438 10.138 6.98438 9.72656L0.851562 15.8516C0.752604 15.9505 0.635417 16 0.5 16C0.364583 16 0.247396 15.9505 0.148438 15.8516C0.0494792 15.7526 0 15.6354 0 15.5C0 15.3646 0.0494792 15.2474 0.148438 15.1484L6.27344 9.01562C5.86198 8.51562 5.54688 7.96875 5.32812 7.375C5.10938 6.77604 5 6.15104 5 5.5C5 4.99479 5.0651 4.50781 5.19531 4.03906C5.32552 3.57031 5.51042 3.13281 5.75 2.72656C5.98958 2.32031 6.27604 1.95052 6.60938 1.61719C6.94792 1.27865 7.32031 0.989583 7.72656 0.75C8.13281 0.510417 8.57031 0.325521 9.03906 0.195312C9.50781 0.0651042 9.99479 0 10.5 0ZM10.5 10C11.1198 10 11.7031 9.88281 12.25 9.64844C12.7969 9.40885 13.2734 9.08594 13.6797 8.67969C14.0859 8.27344 14.4062 7.79688 14.6406 7.25C14.8802 6.70312 15 6.11979 15 5.5C15 4.88021 14.8802 4.29688 14.6406 3.75C14.4062 3.20312 14.0859 2.72656 13.6797 2.32031C13.2734 1.91406 12.7969 1.59375 12.25 1.35938C11.7031 1.11979 11.1198 1 10.5 1C9.88021 1 9.29688 1.11979 8.75 1.35938C8.20312 1.59375 7.72656 1.91406 7.32031 2.32031C6.91406 2.72656 6.59115 3.20312 6.35156 3.75C6.11719 4.29688 6 4.88021 6 5.5C6 6.11979 6.11719 6.70312 6.35156 7.25C6.59115 7.79688 6.91406 8.27344 7.32031 8.67969C7.72656 9.08594 8.20312 9.40885 8.75 9.64844C9.29688 9.88281 9.88021 10 10.5 10Z");
    			add_location(path, file$3, 150, 24, 3915);
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "width", "16px");
    			attr_dev(svg, "height", "16px");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			set_style(svg, "width", "20px");
    			set_style(svg, "height", "20px");
    			add_location(svg, file$3, 149, 20, 3767);
    			attr_dev(span, "class", "search-icon");
    			add_location(span, file$3, 148, 16, 3719);
    			attr_dev(button, "class", "search-button svelte-1qpfvfi");
    			attr_dev(button, "aria-hidden", "true");
    			attr_dev(button, "aria-disabled", "true");
    			attr_dev(button, "aria-label", "제목, 이름 또는 장소를 검색해보세요");
    			add_location(button, file$3, 147, 12, 3559);
    			attr_dev(form, "class", "search-form svelte-1qpfvfi");
    			add_location(form, file$3, 127, 4, 2592);
    			attr_dev(div0, "class", "user-search-container svelte-1qpfvfi");
    			add_location(div0, file$3, 126, 4, 2551);
    			attr_dev(div1, "class", "user-search-wrap svelte-1qpfvfi");
    			add_location(div1, file$3, 125, 0, 2515);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, form);
    			append_dev(form, input);
    			set_input_value(input, /*search_value*/ ctx[1]);
    			append_dev(form, t0);
    			if_blocks[current_block_type_index].m(form, null);
    			append_dev(form, t1);
    			append_dev(form, button);
    			append_dev(button, span);
    			append_dev(span, svg);
    			append_dev(svg, path);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "focus", /*focusHandle*/ ctx[4], false, false, false),
    					listen_dev(input, "blur", /*blurHandle*/ ctx[5], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[7]),
    					listen_dev(button, "click", prevent_default(/*navToBrowse*/ ctx[6]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*search_value*/ 2 && input.value !== /*search_value*/ ctx[1]) {
    				set_input_value(input, /*search_value*/ ctx[1]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(form, t1);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function labelHandle() {
    	document.querySelector('.search-input').focus = true;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserSearch', slots, []);
    	const [send, receive] = crossfade({});
    	let focused = false;
    	let search_value = null;
    	let SEARCH_INPUT;

    	function focusHandle() {
    		$$invalidate(0, focused = true);
    		console.log("focused", focused);
    	}

    	function blurHandle() {
    		$$invalidate(0, focused = false);
    		console.log("blurred", focused);
    	}

    	function navToBrowse() {
    		f.goto("/user/browse");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<UserSearch> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		search_value = this.value;
    		$$invalidate(1, search_value);
    	}

    	$$self.$capture_state = () => ({
    		Route,
    		router: f,
    		crossfade,
    		flip,
    		send,
    		receive,
    		focused,
    		search_value,
    		SEARCH_INPUT,
    		focusHandle,
    		blurHandle,
    		labelHandle,
    		navToBrowse
    	});

    	$$self.$inject_state = $$props => {
    		if ('focused' in $$props) $$invalidate(0, focused = $$props.focused);
    		if ('search_value' in $$props) $$invalidate(1, search_value = $$props.search_value);
    		if ('SEARCH_INPUT' in $$props) SEARCH_INPUT = $$props.SEARCH_INPUT;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		focused,
    		search_value,
    		send,
    		receive,
    		focusHandle,
    		blurHandle,
    		navToBrowse,
    		input_input_handler
    	];
    }

    class UserSearch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserSearch",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* pages/UserMain.svelte generated by Svelte v3.50.1 */
    const file$4 = "pages/UserMain.svelte";

    function create_fragment$5(ctx) {
    	let div3;
    	let div1;
    	let div0;
    	let a0;
    	let h30;
    	let t1;
    	let a1;
    	let h31;
    	let t3;
    	let div2;
    	let usersearch;
    	let current;
    	usersearch = new UserSearch({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			h30 = element("h3");
    			h30.textContent = "관리자";
    			t1 = space();
    			a1 = element("a");
    			h31 = element("h3");
    			h31.textContent = "로그인";
    			t3 = space();
    			div2 = element("div");
    			create_component(usersearch.$$.fragment);
    			attr_dev(h30, "class", "svelte-c93ysu");
    			add_location(h30, file$4, 71, 16, 1436);
    			attr_dev(a0, "href", "/manage");
    			attr_dev(a0, "class", "manage-nav svelte-c93ysu");
    			add_location(a0, file$4, 70, 12, 1381);
    			attr_dev(h31, "class", "svelte-c93ysu");
    			add_location(h31, file$4, 74, 16, 1533);
    			attr_dev(a1, "href", "/login");
    			attr_dev(a1, "class", "login-nav svelte-c93ysu");
    			add_location(a1, file$4, 73, 12, 1480);
    			attr_dev(div0, "class", "user-panel svelte-c93ysu");
    			add_location(div0, file$4, 69, 8, 1343);
    			attr_dev(div1, "class", "user-panel-wrap svelte-c93ysu");
    			add_location(div1, file$4, 68, 4, 1304);
    			attr_dev(div2, "class", "search-wrap svelte-c93ysu");
    			add_location(div2, file$4, 78, 4, 1597);
    			attr_dev(div3, "class", "main-view-home svelte-c93ysu");
    			add_location(div3, file$4, 67, 0, 1270);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(a0, h30);
    			append_dev(div0, t1);
    			append_dev(div0, a1);
    			append_dev(a1, h31);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			mount_component(usersearch, div2, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usersearch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usersearch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(usersearch);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserMain', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserMain> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ UserSearch });
    	return [];
    }

    class UserMain extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserMain",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* pages/sidebar/Category.svelte generated by Svelte v3.50.1 */
    const file$5 = "pages/sidebar/Category.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (95:4) {:else}
    function create_else_block$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M19.5 8.25l-7.5 7.5-7.5-7.5");
    			add_location(path, file$5, 96, 8, 2270);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "3");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "class", "w-6 h-6 svelte-1lzq6gj");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			add_location(svg, file$5, 95, 4, 2111);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(95:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (91:4) {#if selected_index == index}
    function create_if_block_1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M4.5 15.75l7.5-7.5 7.5 7.5");
    			add_location(path, file$5, 92, 12, 1993);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "3");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "class", "w-6 h-6 svelte-1lzq6gj");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			add_location(svg, file$5, 91, 8, 1830);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(91:4) {#if selected_index == index}",
    		ctx
    	});

    	return block;
    }

    // (101:0) {#if selected_index == index}
    function create_if_block$2(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;
    	let each_value = /*sub_categories*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "sub-category-container svelte-1lzq6gj");
    			add_location(div, file$5, 101, 4, 2420);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*sub_categories*/ 8) {
    				each_value = /*sub_categories*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);

    				div_intro = create_in_transition(div, fly, {
    					duration: 400,
    					x: 0,
    					y: -200,
    					easing: quintOut
    				});

    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();

    			div_outro = create_out_transition(div, fly, {
    				duration: 10,
    				x: 0,
    				y: -200,
    				easing: quadIn
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(101:0) {#if selected_index == index}",
    		ctx
    	});

    	return block;
    }

    // (103:8) {#each sub_categories as sub_category, sub_index}
    function create_each_block(ctx) {
    	let div;
    	let h3;
    	let t0_value = /*sub_category*/ ctx[6] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(h3, "class", "svelte-1lzq6gj");
    			add_location(h3, file$5, 104, 12, 2670);
    			attr_dev(div, "class", "sub-category svelte-1lzq6gj");
    			add_location(div, file$5, 103, 8, 2631);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(103:8) {#each sub_categories as sub_category, sub_index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let h3;
    	let t0;
    	let t1;
    	let t2;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*selected_index*/ ctx[1] == /*index*/ ctx[2]) return create_if_block_1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*selected_index*/ ctx[1] == /*index*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(/*category*/ ctx[0]);
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(h3, "class", "svelte-1lzq6gj");
    			add_location(h3, file$5, 89, 4, 1768);
    			attr_dev(div, "class", "category svelte-1lzq6gj");
    			add_location(div, file$5, 88, 0, 1715);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    			if_block0.m(div, null);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*categorySelect*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*category*/ 1) set_data_dev(t0, /*category*/ ctx[0]);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, null);
    				}
    			}

    			if (/*selected_index*/ ctx[1] == /*index*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*selected_index, index*/ 6) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Category', slots, []);
    	let { category = "이름없음" } = $$props;
    	let { selected_index = null } = $$props;
    	let { index = 0 } = $$props;
    	let sub_categories = ["행사", "훈련", "교육", "교장"];
    	var dispatch = createEventDispatcher();

    	function categorySelect() {
    		if (index == selected_index) {
    			dispatch('click', { index: null });
    		} else {
    			dispatch('click', { index });
    		}
    	}

    	const writable_props = ['category', 'selected_index', 'index'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Category> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('category' in $$props) $$invalidate(0, category = $$props.category);
    		if ('selected_index' in $$props) $$invalidate(1, selected_index = $$props.selected_index);
    		if ('index' in $$props) $$invalidate(2, index = $$props.index);
    	};

    	$$self.$capture_state = () => ({
    		category,
    		selected_index,
    		index,
    		sub_categories,
    		createEventDispatcher,
    		fly,
    		quintIn,
    		quintOut,
    		quadIn,
    		dispatch,
    		categorySelect
    	});

    	$$self.$inject_state = $$props => {
    		if ('category' in $$props) $$invalidate(0, category = $$props.category);
    		if ('selected_index' in $$props) $$invalidate(1, selected_index = $$props.selected_index);
    		if ('index' in $$props) $$invalidate(2, index = $$props.index);
    		if ('sub_categories' in $$props) $$invalidate(3, sub_categories = $$props.sub_categories);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [category, selected_index, index, sub_categories, categorySelect];
    }

    class Category extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { category: 0, selected_index: 1, index: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Category",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get category() {
    		throw new Error("<Category>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<Category>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected_index() {
    		throw new Error("<Category>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected_index(value) {
    		throw new Error("<Category>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Category>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Category>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* pages/content_container/ContentItem.svelte generated by Svelte v3.50.1 */
    const file$6 = "pages/content_container/ContentItem.svelte";

    function create_fragment$7(ctx) {
    	let div5;
    	let div4;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h30;
    	let t1_value = /*item*/ ctx[0].title + "";
    	let t1;
    	let t2;
    	let div2;
    	let h31;
    	let t3_value = /*item*/ ctx[0].created_at + "";
    	let t3;
    	let t4;
    	let div3;
    	let h32;
    	let t5;
    	let t6_value = /*item*/ ctx[0].associate + "";
    	let t6;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h30 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			h31 = element("h3");
    			t3 = text(t3_value);
    			t4 = space();
    			div3 = element("div");
    			h32 = element("h3");
    			t5 = text("촬영자: ");
    			t6 = text(t6_value);
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[0].src[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "100%");
    			add_location(img, file$6, 92, 12, 1958);
    			attr_dev(div0, "class", "img-container svelte-1al6yfm");
    			add_location(div0, file$6, 91, 8, 1918);
    			attr_dev(h30, "class", "svelte-1al6yfm");
    			add_location(h30, file$6, 96, 12, 2091);
    			attr_dev(div1, "class", "title-container svelte-1al6yfm");
    			add_location(div1, file$6, 95, 8, 2049);
    			attr_dev(h31, "class", "svelte-1al6yfm");
    			add_location(h31, file$6, 99, 12, 2177);
    			attr_dev(div2, "class", "date-container svelte-1al6yfm");
    			add_location(div2, file$6, 98, 8, 2136);
    			attr_dev(h32, "class", "svelte-1al6yfm");
    			add_location(h32, file$6, 102, 12, 2271);
    			attr_dev(div3, "class", "creater-container svelte-1al6yfm");
    			add_location(div3, file$6, 101, 8, 2227);
    			attr_dev(div4, "class", "content-item-folder svelte-1al6yfm");
    			add_location(div4, file$6, 90, 4, 1876);
    			attr_dev(div5, "class", "browse-contents-list-item svelte-1al6yfm");
    			add_location(div5, file$6, 89, 0, 1809);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			append_dev(div0, img);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div1, h30);
    			append_dev(h30, t1);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(h31, t3);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, h32);
    			append_dev(h32, t5);
    			append_dev(h32, t6);

    			if (!mounted) {
    				dispose = listen_dev(div5, "click", /*clickHandle*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*item*/ 1 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[0].src[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*item*/ 1 && t1_value !== (t1_value = /*item*/ ctx[0].title + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*item*/ 1 && t3_value !== (t3_value = /*item*/ ctx[0].created_at + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*item*/ 1 && t6_value !== (t6_value = /*item*/ ctx[0].associate + "")) set_data_dev(t6, t6_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContentItem', slots, []);
    	var dispatch = createEventDispatcher();
    	let { item } = $$props;

    	function clickHandle() {
    		dispatch('click', { item });
    	}

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContentItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		item,
    		clickHandle
    	});

    	$$self.$inject_state = $$props => {
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, clickHandle];
    }

    class ContentItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContentItem",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<ContentItem> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<ContentItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<ContentItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    // utils is a library of generic helper functions non-specific to axios

    var toString = Object.prototype.toString;

    // eslint-disable-next-line func-names
    var kindOf = (function(cache) {
      // eslint-disable-next-line func-names
      return function(thing) {
        var str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
      };
    })(Object.create(null));

    function kindOfTest(type) {
      type = type.toLowerCase();
      return function isKindOf(thing) {
        return kindOf(thing) === type;
      };
    }

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray(val) {
      return Array.isArray(val);
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    var isArrayBuffer = kindOfTest('ArrayBuffer');


    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject(val) {
      if (kindOf(val) !== 'object') {
        return false;
      }

      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is a Date
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    var isDate = kindOfTest('Date');

    /**
     * Determine if a value is a File
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    var isFile = kindOfTest('File');

    /**
     * Determine if a value is a Blob
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    var isBlob = kindOfTest('Blob');

    /**
     * Determine if a value is a FileList
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    var isFileList = kindOfTest('FileList');

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} thing The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(thing) {
      var pattern = '[object FormData]';
      return thing && (
        (typeof FormData === 'function' && thing instanceof FormData) ||
        toString.call(thing) === pattern ||
        (isFunction(thing.toString) && thing.toString() === pattern)
      );
    }

    /**
     * Determine if a value is a URLSearchParams object
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    var isURLSearchParams = kindOfTest('URLSearchParams');

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
    }

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */
    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    }

    /**
     * Inherit the prototype methods from one constructor into another
     * @param {function} constructor
     * @param {function} superConstructor
     * @param {object} [props]
     * @param {object} [descriptors]
     */

    function inherits(constructor, superConstructor, props, descriptors) {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors);
      constructor.prototype.constructor = constructor;
      props && Object.assign(constructor.prototype, props);
    }

    /**
     * Resolve object with deep prototype chain to a flat object
     * @param {Object} sourceObj source object
     * @param {Object} [destObj]
     * @param {Function} [filter]
     * @returns {Object}
     */

    function toFlatObject(sourceObj, destObj, filter) {
      var props;
      var i;
      var prop;
      var merged = {};

      destObj = destObj || {};

      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if (!merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = Object.getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

      return destObj;
    }

    /*
     * determines whether a string ends with the characters of a specified string
     * @param {String} str
     * @param {String} searchString
     * @param {Number} [position= 0]
     * @returns {boolean}
     */
    function endsWith(str, searchString, position) {
      str = String(str);
      if (position === undefined || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      var lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }


    /**
     * Returns new array from array like object
     * @param {*} [thing]
     * @returns {Array}
     */
    function toArray(thing) {
      if (!thing) return null;
      var i = thing.length;
      if (isUndefined(i)) return null;
      var arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    }

    // eslint-disable-next-line func-names
    var isTypedArray = (function(TypedArray) {
      // eslint-disable-next-line func-names
      return function(thing) {
        return TypedArray && thing instanceof TypedArray;
      };
    })(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

    var utils = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      extend: extend,
      trim: trim,
      stripBOM: stripBOM,
      inherits: inherits,
      toFlatObject: toFlatObject,
      kindOf: kindOf,
      kindOfTest: kindOfTest,
      endsWith: endsWith,
      toArray: toArray,
      isTypedArray: isTypedArray,
      isFileList: isFileList
    };

    function encode(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    function InterceptorManager() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager;

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [config] The config.
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    function AxiosError(message, code, config, request, response) {
      Error.call(this);
      this.message = message;
      this.name = 'AxiosError';
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      response && (this.response = response);
    }

    utils.inherits(AxiosError, Error, {
      toJSON: function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      }
    });

    var prototype = AxiosError.prototype;
    var descriptors = {};

    [
      'ERR_BAD_OPTION_VALUE',
      'ERR_BAD_OPTION',
      'ECONNABORTED',
      'ETIMEDOUT',
      'ERR_NETWORK',
      'ERR_FR_TOO_MANY_REDIRECTS',
      'ERR_DEPRECATED',
      'ERR_BAD_RESPONSE',
      'ERR_BAD_REQUEST',
      'ERR_CANCELED'
    // eslint-disable-next-line func-names
    ].forEach(function(code) {
      descriptors[code] = {value: code};
    });

    Object.defineProperties(AxiosError, descriptors);
    Object.defineProperty(prototype, 'isAxiosError', {value: true});

    // eslint-disable-next-line func-names
    AxiosError.from = function(error, code, config, request, response, customProps) {
      var axiosError = Object.create(prototype);

      utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      });

      AxiosError.call(axiosError, error.message, code, config, request, response);

      axiosError.name = error.name;

      customProps && Object.assign(axiosError, customProps);

      return axiosError;
    };

    var AxiosError_1 = AxiosError;

    var transitional = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };

    /**
     * Convert a data object to FormData
     * @param {Object} obj
     * @param {?Object} [formData]
     * @returns {Object}
     **/

    function toFormData(obj, formData) {
      // eslint-disable-next-line no-param-reassign
      formData = formData || new FormData();

      var stack = [];

      function convertValue(value) {
        if (value === null) return '';

        if (utils.isDate(value)) {
          return value.toISOString();
        }

        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
          return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
        }

        return value;
      }

      function build(data, parentKey) {
        if (utils.isPlainObject(data) || utils.isArray(data)) {
          if (stack.indexOf(data) !== -1) {
            throw Error('Circular reference detected in ' + parentKey);
          }

          stack.push(data);

          utils.forEach(data, function each(value, key) {
            if (utils.isUndefined(value)) return;
            var fullKey = parentKey ? parentKey + '.' + key : key;
            var arr;

            if (value && !parentKey && typeof value === 'object') {
              if (utils.endsWith(key, '{}')) {
                // eslint-disable-next-line no-param-reassign
                value = JSON.stringify(value);
              } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
                // eslint-disable-next-line func-names
                arr.forEach(function(el) {
                  !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
                });
                return;
              }
            }

            build(value, fullKey);
          });

          stack.pop();
        } else {
          formData.append(parentKey, convertValue(data));
        }
      }

      build(obj);

      return formData;
    }

    var toFormData_1 = toFormData;

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError_1(
          'Request failed with status code ' + response.status,
          [AxiosError_1.ERR_BAD_REQUEST, AxiosError_1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    };

    var cookies = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));

              if (utils.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }

              if (utils.isString(path)) {
                cookie.push('path=' + path);
              }

              if (utils.isString(domain)) {
                cookie.push('domain=' + domain);
              }

              if (secure === true) {
                cookie.push('secure');
              }

              document.cookie = cookie.join('; ');
            },

            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :

      // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) { return parsed; }

      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });

      return parsed;
    };

    var isURLSameOrigin = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;

          /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
          function resolveURL(url) {
            var href = url;

            if (msie) {
            // IE needs attribute set twice to normalize properties
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }

            urlParsingNode.setAttribute('href', href);

            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }

          originURL = resolveURL(window.location.href);

          /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    /**
     * A `CanceledError` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function CanceledError(message) {
      // eslint-disable-next-line no-eq-null,eqeqeq
      AxiosError_1.call(this, message == null ? 'canceled' : message, AxiosError_1.ERR_CANCELED);
      this.name = 'CanceledError';
    }

    utils.inherits(CanceledError, AxiosError_1, {
      __CANCEL__: true
    });

    var CanceledError_1 = CanceledError;

    var parseProtocol = function parseProtocol(url) {
      var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || '';
    };

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }

          if (config.signal) {
            config.signal.removeEventListener('abort', onCanceled);
          }
        }

        if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath(config.baseURL, config.url);

        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        function onloadend() {
          if (!request) {
            return;
          }
          // Prepare the response
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
            request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };

          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);

          // Clean up request
          request = null;
        }

        if ('onloadend' in request) {
          // Use onloadend if available
          request.onloadend = onloadend;
        } else {
          // Listen for ready state to emulate onloadend
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
              return;
            }
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
          };
        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(new AxiosError_1('Request aborted', AxiosError_1.ECONNABORTED, config, request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(new AxiosError_1('Network Error', AxiosError_1.ERR_NETWORK, config, request, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
          var transitional$1 = config.transitional || transitional;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError_1(
            timeoutErrorMessage,
            transitional$1.clarifyTimeoutError ? AxiosError_1.ETIMEDOUT : AxiosError_1.ECONNABORTED,
            config,
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils.isStandardBrowserEnv()) {
          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        }

        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
          request.responseType = config.responseType;
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken || config.signal) {
          // Handle cancellation
          // eslint-disable-next-line func-names
          onCanceled = function(cancel) {
            if (!request) {
              return;
            }
            reject(!cancel || (cancel && cancel.type) ? new CanceledError_1() : cancel);
            request.abort();
            request = null;
          };

          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
          }
        }

        if (!requestData) {
          requestData = null;
        }

        var protocol = parseProtocol(fullPath);

        if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
          reject(new AxiosError_1('Unsupported protocol ' + protocol + ':', AxiosError_1.ERR_BAD_REQUEST, config));
          return;
        }


        // Send the request
        request.send(requestData);
      });
    };

    // eslint-disable-next-line strict
    var _null = null;

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = xhr;
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = xhr;
      }
      return adapter;
    }

    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e;
          }
        }
      }

      return (encoder || JSON.stringify)(rawValue);
    }

    var defaults = {

      transitional: transitional,

      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');

        if (utils.isFormData(data) ||
          utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }

        var isObjectPayload = utils.isObject(data);
        var contentType = headers && headers['Content-Type'];

        var isFileList;

        if ((isFileList = utils.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
          var _FormData = this.env && this.env.FormData;
          return toFormData_1(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
        } else if (isObjectPayload || contentType === 'application/json') {
          setContentTypeIfUnset(headers, 'application/json');
          return stringifySafely(data);
        }

        return data;
      }],

      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional || defaults.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

        if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === 'SyntaxError') {
                throw AxiosError_1.from(e, AxiosError_1.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }

        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      env: {
        FormData: _null
      },

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },

      headers: {
        common: {
          'Accept': 'application/json, text/plain, */*'
        }
      }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData = function transformData(data, headers, fns) {
      var context = this || defaults_1;
      /*eslint no-param-reassign:0*/
      utils.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });

      return data;
    };

    var isCancel = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }

      if (config.signal && config.signal.aborted) {
        throw new CanceledError_1();
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );

      utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults_1.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData.call(
          config,
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};

      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      // eslint-disable-next-line consistent-return
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      var mergeMap = {
        'url': valueFromConfig2,
        'method': valueFromConfig2,
        'data': valueFromConfig2,
        'baseURL': defaultToConfig2,
        'transformRequest': defaultToConfig2,
        'transformResponse': defaultToConfig2,
        'paramsSerializer': defaultToConfig2,
        'timeout': defaultToConfig2,
        'timeoutMessage': defaultToConfig2,
        'withCredentials': defaultToConfig2,
        'adapter': defaultToConfig2,
        'responseType': defaultToConfig2,
        'xsrfCookieName': defaultToConfig2,
        'xsrfHeaderName': defaultToConfig2,
        'onUploadProgress': defaultToConfig2,
        'onDownloadProgress': defaultToConfig2,
        'decompress': defaultToConfig2,
        'maxContentLength': defaultToConfig2,
        'maxBodyLength': defaultToConfig2,
        'beforeRedirect': defaultToConfig2,
        'transport': defaultToConfig2,
        'httpAgent': defaultToConfig2,
        'httpsAgent': defaultToConfig2,
        'cancelToken': defaultToConfig2,
        'socketPath': defaultToConfig2,
        'responseEncoding': defaultToConfig2,
        'validateStatus': mergeDirectKeys
      };

      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        var merge = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge(prop);
        (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
      });

      return config;
    };

    var data = {
      "version": "0.27.2"
    };

    var VERSION = data.version;


    var validators = {};

    // eslint-disable-next-line func-names
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
      validators[type] = function validator(thing) {
        return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
      };
    });

    var deprecatedWarnings = {};

    /**
     * Transitional option validator
     * @param {function|boolean?} validator - set to false if the transitional option has been removed
     * @param {string?} version - deprecated version / removed since version
     * @param {string?} message - some message with additional info
     * @returns {function}
     */
    validators.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
      }

      // eslint-disable-next-line func-names
      return function(value, opt, opts) {
        if (validator === false) {
          throw new AxiosError_1(
            formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
            AxiosError_1.ERR_DEPRECATED
          );
        }

        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          // eslint-disable-next-line no-console
          console.warn(
            formatMessage(
              opt,
              ' has been deprecated since v' + version + ' and will be removed in the near future'
            )
          );
        }

        return validator ? validator(value, opt, opts) : true;
      };
    };

    /**
     * Assert object's properties type
     * @param {object} options
     * @param {object} schema
     * @param {boolean?} allowUnknown
     */

    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new AxiosError_1('options must be an object', AxiosError_1.ERR_BAD_OPTION_VALUE);
      }
      var keys = Object.keys(options);
      var i = keys.length;
      while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === undefined || validator(value, opt, options);
          if (result !== true) {
            throw new AxiosError_1('option ' + opt + ' must be ' + result, AxiosError_1.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError_1('Unknown option ' + opt, AxiosError_1.ERR_BAD_OPTION);
        }
      }
    }

    var validator = {
      assertOptions: assertOptions,
      validators: validators
    };

    var validators$1 = validator.validators;
    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_1(),
        response: new InterceptorManager_1()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(configOrUrl, config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof configOrUrl === 'string') {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }

      config = mergeConfig(this.defaults, config);

      // Set config.method
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }

      var transitional = config.transitional;

      if (transitional !== undefined) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators$1.transitional(validators$1.boolean),
          forcedJSONParsing: validators$1.transitional(validators$1.boolean),
          clarifyTimeoutError: validators$1.transitional(validators$1.boolean)
        }, false);
      }

      // filter out skipped interceptors
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
          return;
        }

        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });

      var promise;

      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, undefined];

        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);

        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
      }


      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }

      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }

      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }

      return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      var fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    };

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/

      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method: method,
            headers: isForm ? {
              'Content-Type': 'multipart/form-data'
            } : {},
            url: url,
            data: data
          }));
        };
      }

      Axios.prototype[method] = generateHTTPMethod();

      Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
    });

    var Axios_1 = Axios;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;

      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;

      // eslint-disable-next-line func-names
      this.promise.then(function(cancel) {
        if (!token._listeners) return;

        var i;
        var l = token._listeners.length;

        for (i = 0; i < l; i++) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });

      // eslint-disable-next-line func-names
      this.promise.then = function(onfulfilled) {
        var _resolve;
        // eslint-disable-next-line func-names
        var promise = new Promise(function(resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);

        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };

        return promise;
      };

      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new CanceledError_1(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Subscribe to the cancel signal
     */

    CancelToken.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }

      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };

    /**
     * Unsubscribe from the cancel signal
     */

    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    var isAxiosError = function isAxiosError(payload) {
      return utils.isObject(payload) && (payload.isAxiosError === true);
    };

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios_1(defaultConfig);
      var instance = bind(Axios_1.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios_1.prototype, context);

      // Copy context to instance
      utils.extend(instance, context);

      // Factory for creating new instances
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };

      return instance;
    }

    // Create the default instance to be exported
    var axios = createInstance(defaults_1);

    // Expose Axios class to allow class inheritance
    axios.Axios = Axios_1;

    // Expose Cancel & CancelToken
    axios.CanceledError = CanceledError_1;
    axios.CancelToken = CancelToken_1;
    axios.isCancel = isCancel;
    axios.VERSION = data.version;
    axios.toFormData = toFormData_1;

    // Expose AxiosError class
    axios.AxiosError = AxiosError_1;

    // alias for CanceledError for backward compatibility
    axios.Cancel = axios.CanceledError;

    // Expose all/spread
    axios.all = function all(promises) {
      return Promise.all(promises);
    };
    axios.spread = spread;

    // Expose isAxiosError
    axios.isAxiosError = isAxiosError;

    var axios_1 = axios;

    // Allow use of default import syntax in TypeScript
    var default_1 = axios;
    axios_1.default = default_1;

    var axios$1 = axios_1;

    /* pages/content_container/ContentView.svelte generated by Svelte v3.50.1 */

    const { console: console_1$1 } = globals;
    const file_1 = "pages/content_container/ContentView.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[22] = i;
    	return child_ctx;
    }

    // (410:8) {:catch error}
    function create_catch_block(ctx) {
    	let div;
    	let svg;
    	let path;
    	let t0;
    	let h3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			h3 = element("h3");
    			h3.textContent = "다시 시도 바랍니다";
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z");
    			add_location(path, file_1, 412, 20, 9525);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "1.5");
    			attr_dev(svg, "stroke", "rgb(226, 41, 41)");
    			attr_dev(svg, "height", "18");
    			attr_dev(svg, "width", "18");
    			add_location(svg, file_1, 411, 16, 9363);
    			attr_dev(div, "class", "approved-mark-wrap svelte-1m9zcdz");
    			add_location(div, file_1, 410, 12, 9313);
    			attr_dev(h3, "class", "svelte-1m9zcdz");
    			add_location(h3, file_1, 415, 12, 9819);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h3, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(410:8) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (401:8) {:then result}
    function create_then_block(ctx) {
    	let div;
    	let svg;
    	let path;
    	let path_intro;
    	let t0;
    	let h3;
    	let t1_value = /*result*/ ctx[23].title + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			h3 = element("h3");
    			t1 = text(t1_value);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z");
    			add_location(path, file_1, 403, 20, 9008);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "rgb(99, 228, 99)");
    			attr_dev(svg, "height", "18");
    			attr_dev(svg, "width", "18");
    			add_location(svg, file_1, 402, 16, 8848);
    			attr_dev(div, "class", "approved-mark-wrap svelte-1m9zcdz");
    			add_location(div, file_1, 401, 12, 8798);
    			attr_dev(h3, "class", "svelte-1m9zcdz");
    			add_location(h3, file_1, 406, 12, 9220);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t1);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (!path_intro) {
    				add_render_callback(() => {
    					path_intro = create_in_transition(path, draw, { duration: 700, speed: 1 });
    					path_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(401:8) {:then result}",
    		ctx
    	});

    	return block;
    }

    // (395:39)               <div class="approved-mark-wrap">              </div>              <h3>                  파일을 받아오는 중입니다              </h3>          {:then result}
    function create_pending_block(ctx) {
    	let div;
    	let t0;
    	let h3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			h3 = element("h3");
    			h3.textContent = "파일을 받아오는 중입니다";
    			attr_dev(div, "class", "approved-mark-wrap svelte-1m9zcdz");
    			add_location(div, file_1, 395, 12, 8640);
    			attr_dev(h3, "class", "svelte-1m9zcdz");
    			add_location(h3, file_1, 397, 12, 8706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h3, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(395:39)               <div class=\\\"approved-mark-wrap\\\">              </div>              <h3>                  파일을 받아오는 중입니다              </h3>          {:then result}",
    		ctx
    	});

    	return block;
    }

    // (422:8) {#if status == 1}
    function create_if_block_7(ctx) {
    	let div4;
    	let div1;
    	let svg0;
    	let path0;
    	let t0;
    	let div0;
    	let t1;
    	let h30;
    	let t2_value = /*file*/ ctx[0].associate + "";
    	let t2;
    	let t3;
    	let div3;
    	let svg1;
    	let path1;
    	let t4;
    	let div2;
    	let t5;
    	let h31;
    	let t6_value = /*file*/ ctx[0].created_at + "";
    	let t6;
    	let t7;
    	let div8;
    	let div5;
    	let svg2;
    	let path2;
    	let t8;
    	let div6;
    	let svg3;
    	let path3;
    	let t9;
    	let div7;
    	let svg4;
    	let path4;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			h30 = element("h3");
    			t2 = text(t2_value);
    			t3 = space();
    			div3 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t4 = space();
    			div2 = element("div");
    			t5 = space();
    			h31 = element("h3");
    			t6 = text(t6_value);
    			t7 = space();
    			div8 = element("div");
    			div5 = element("div");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t8 = space();
    			div6 = element("div");
    			svg3 = svg_element("svg");
    			path3 = svg_element("path");
    			t9 = space();
    			div7 = element("div");
    			svg4 = svg_element("svg");
    			path4 = svg_element("path");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "d", "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z");
    			add_location(path0, file_1, 425, 24, 10179);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-width", "2");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "height", "11");
    			attr_dev(svg0, "width", "11");
    			add_location(svg0, file_1, 424, 20, 10019);
    			attr_dev(div0, "class", "space svelte-1m9zcdz");
    			add_location(div0, file_1, 427, 20, 10433);
    			attr_dev(h30, "class", "svelte-1m9zcdz");
    			add_location(h30, file_1, 428, 20, 10480);
    			attr_dev(div1, "class", "name-wrap svelte-1m9zcdz");
    			add_location(div1, file_1, 423, 16, 9974);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "d", "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5");
    			add_location(path1, file_1, 432, 24, 10752);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "2");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "height", "11");
    			attr_dev(svg1, "width", "11");
    			add_location(svg1, file_1, 431, 20, 10592);
    			attr_dev(div2, "class", "space svelte-1m9zcdz");
    			add_location(div2, file_1, 434, 20, 11075);
    			attr_dev(h31, "class", "svelte-1m9zcdz");
    			add_location(h31, file_1, 435, 20, 11122);
    			attr_dev(div3, "class", "date-wrap svelte-1m9zcdz");
    			add_location(div3, file_1, 430, 16, 10547);
    			attr_dev(div4, "class", "info-wrap svelte-1m9zcdz");
    			add_location(div4, file_1, 422, 12, 9933);
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "d", "M12 4.5v15m7.5-7.5h-15");
    			add_location(path2, file_1, 442, 24, 11459);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "fill", "none");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "stroke-width", "2");
    			attr_dev(svg2, "stroke", "currentColor");
    			attr_dev(svg2, "height", "18");
    			attr_dev(svg2, "width", "18");
    			add_location(svg2, file_1, 441, 20, 11299);
    			attr_dev(div5, "class", "fix-wrap icon svelte-1m9zcdz");
    			add_location(div5, file_1, 440, 16, 11250);
    			attr_dev(path3, "stroke-linecap", "round");
    			attr_dev(path3, "stroke-linejoin", "round");
    			attr_dev(path3, "d", "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0");
    			add_location(path3, file_1, 447, 24, 11821);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "fill", "none");
    			attr_dev(svg3, "viewBox", "0 0 24 24");
    			attr_dev(svg3, "stroke-width", "2");
    			attr_dev(svg3, "stroke", "currentColor");
    			attr_dev(svg3, "height", "18");
    			attr_dev(svg3, "width", "18");
    			add_location(svg3, file_1, 446, 20, 11661);
    			attr_dev(div6, "class", "bell-wrap icon svelte-1m9zcdz");
    			add_location(div6, file_1, 445, 16, 11611);
    			attr_dev(path4, "stroke-linecap", "round");
    			attr_dev(path4, "stroke-linejoin", "round");
    			attr_dev(path4, "d", "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3");
    			add_location(path4, file_1, 452, 24, 12374);
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "fill", "none");
    			attr_dev(svg4, "viewBox", "0 0 24 24");
    			attr_dev(svg4, "stroke-width", "2");
    			attr_dev(svg4, "stroke", "currentColor");
    			attr_dev(svg4, "height", "18");
    			attr_dev(svg4, "width", "18");
    			add_location(svg4, file_1, 451, 20, 12214);
    			attr_dev(div7, "class", "download-wrap icon svelte-1m9zcdz");
    			add_location(div7, file_1, 450, 16, 12160);
    			attr_dev(div8, "class", "icons-wrap svelte-1m9zcdz");
    			add_location(div8, file_1, 439, 12, 11208);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, svg0);
    			append_dev(svg0, path0);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h30);
    			append_dev(h30, t2);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, svg1);
    			append_dev(svg1, path1);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div3, t5);
    			append_dev(div3, h31);
    			append_dev(h31, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div5);
    			append_dev(div5, svg2);
    			append_dev(svg2, path2);
    			append_dev(div8, t8);
    			append_dev(div8, div6);
    			append_dev(div6, svg3);
    			append_dev(svg3, path3);
    			append_dev(div8, t9);
    			append_dev(div8, div7);
    			append_dev(div7, svg4);
    			append_dev(svg4, path4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*file*/ 1 && t2_value !== (t2_value = /*file*/ ctx[0].associate + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*file*/ 1 && t6_value !== (t6_value = /*file*/ ctx[0].created_at + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(422:8) {#if status == 1}",
    		ctx
    	});

    	return block;
    }

    // (572:8) {:else}
    function create_else_block_4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "body-content-wrap-unauthorized");
    			add_location(div, file_1, 572, 12, 19414);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(572:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (461:8) {#if user.authority}
    function create_if_block$3(ctx) {
    	let div;

    	function select_block_type_1(ctx, dirty) {
    		if (/*status*/ ctx[6] == 0) return create_if_block_1$1;
    		if (/*status*/ ctx[6] == 2) return create_if_block_6;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "body-content-wrap svelte-1m9zcdz");
    			add_location(div, file_1, 461, 12, 12707);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (if_block) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(461:8) {#if user.authority}",
    		ctx
    	});

    	return block;
    }

    // (568:38) 
    function create_if_block_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Error!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(568:38) ",
    		ctx
    	});

    	return block;
    }

    // (464:16) {#if status == 0}
    function create_if_block_1$1(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let img;
    	let img_src_value;
    	let t1;
    	let t2;
    	let div17;
    	let div2;
    	let h50;
    	let t4;
    	let div14;
    	let div5;
    	let div3;
    	let h51;
    	let t6;
    	let div4;
    	let h52;
    	let t7;
    	let t8_value = /*file*/ ctx[0].location + "";
    	let t8;
    	let t9;
    	let div8;
    	let div6;
    	let h53;
    	let t11;
    	let div7;
    	let h54;
    	let t12;
    	let t13_value = /*file*/ ctx[0].associate + "";
    	let t13;
    	let t14;
    	let div11;
    	let div9;
    	let h55;
    	let t16;
    	let div10;
    	let t17;
    	let div12;
    	let t18;
    	let div13;
    	let t19;
    	let div15;
    	let h56;
    	let t21;
    	let div16;
    	let mounted;
    	let dispose;
    	let if_block0 = /*img_hover*/ ctx[3] && create_if_block_5(ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (/*img_hover*/ ctx[3]) return create_if_block_4;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block1 = current_block_type(ctx);
    	let each_value = /*file*/ ctx[0].attendee;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_2(ctx);
    	}

    	function select_block_type_3(ctx, dirty) {
    		if (/*file*/ ctx[0].collected) return create_if_block_3;
    		return create_else_block_1;
    	}

    	let current_block_type_1 = select_block_type_3(ctx);
    	let if_block2 = current_block_type_1(ctx);

    	function select_block_type_4(ctx, dirty) {
    		if (/*file*/ ctx[0].private) return create_if_block_2;
    		return create_else_block$2;
    	}

    	let current_block_type_2 = select_block_type_4(ctx);
    	let if_block3 = current_block_type_2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			img = element("img");
    			t1 = space();
    			if_block1.c();
    			t2 = space();
    			div17 = element("div");
    			div2 = element("div");
    			h50 = element("h5");
    			h50.textContent = "세부사항";
    			t4 = space();
    			div14 = element("div");
    			div5 = element("div");
    			div3 = element("div");
    			h51 = element("h5");
    			h51.textContent = "대표장소:";
    			t6 = space();
    			div4 = element("div");
    			h52 = element("h5");
    			t7 = text("@");
    			t8 = text(t8_value);
    			t9 = space();
    			div8 = element("div");
    			div6 = element("div");
    			h53 = element("h5");
    			h53.textContent = "촬영자:";
    			t11 = space();
    			div7 = element("div");
    			h54 = element("h5");
    			t12 = text("#");
    			t13 = text(t13_value);
    			t14 = space();
    			div11 = element("div");
    			div9 = element("div");
    			h55 = element("h5");
    			h55.textContent = "주요참석자:";
    			t16 = space();
    			div10 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			t17 = space();
    			div12 = element("div");
    			if_block2.c();
    			t18 = space();
    			div13 = element("div");
    			if_block3.c();
    			t19 = space();
    			div15 = element("div");
    			h56 = element("h5");
    			h56.textContent = "설명";
    			t21 = space();
    			div16 = element("div");
    			if (!src_url_equal(img.src, img_src_value = /*curr*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "main_pg_bg");
    			add_location(img, file_1, 481, 24, 14094);
    			attr_dev(div0, "class", "photo-container svelte-1m9zcdz");
    			add_location(div0, file_1, 465, 20, 12908);
    			attr_dev(div1, "class", "media-wrap svelte-1m9zcdz");
    			add_location(div1, file_1, 464, 16, 12862);
    			attr_dev(h50, "class", "svelte-1m9zcdz");
    			add_location(h50, file_1, 494, 24, 14653);
    			attr_dev(div2, "class", "info-header svelte-1m9zcdz");
    			add_location(div2, file_1, 493, 20, 14602);
    			add_location(h51, file_1, 499, 32, 14892);
    			attr_dev(div3, "class", "label");
    			add_location(div3, file_1, 498, 28, 14839);
    			add_location(h52, file_1, 502, 32, 15046);
    			attr_dev(div4, "class", "location info-item-content svelte-1m9zcdz");
    			add_location(div4, file_1, 501, 28, 14972);
    			attr_dev(div5, "class", "location-wrap info-item svelte-1m9zcdz");
    			add_location(div5, file_1, 497, 24, 14772);
    			add_location(h53, file_1, 508, 32, 15320);
    			attr_dev(div6, "class", "label");
    			add_location(div6, file_1, 507, 28, 15267);
    			add_location(h54, file_1, 511, 32, 15474);
    			attr_dev(div7, "class", "associate info-item-content svelte-1m9zcdz");
    			add_location(div7, file_1, 510, 28, 15399);
    			attr_dev(div8, "class", "assosiate-wrap info-item svelte-1m9zcdz");
    			add_location(div8, file_1, 506, 24, 15199);
    			add_location(h55, file_1, 516, 32, 15714);
    			attr_dev(div9, "class", "label");
    			add_location(div9, file_1, 515, 28, 15661);
    			attr_dev(div10, "class", "attendees info-item-content svelte-1m9zcdz");
    			add_location(div10, file_1, 518, 28, 15795);
    			attr_dev(div11, "class", "attendee-wrap info-item svelte-1m9zcdz");
    			add_location(div11, file_1, 514, 24, 15594);
    			attr_dev(div12, "class", "collected-wrap info-item svelte-1m9zcdz");
    			add_location(div12, file_1, 526, 24, 16204);
    			attr_dev(div13, "class", "private-wrap info-item svelte-1m9zcdz");
    			add_location(div13, file_1, 543, 24, 17596);
    			attr_dev(div14, "class", "detail-wrap-info svelte-1m9zcdz");
    			add_location(div14, file_1, 496, 20, 14716);
    			attr_dev(h56, "class", "svelte-1m9zcdz");
    			add_location(h56, file_1, 562, 24, 19073);
    			attr_dev(div15, "class", "content-header svelte-1m9zcdz");
    			add_location(div15, file_1, 561, 20, 19019);
    			attr_dev(div16, "class", "detail-wrap-content svelte-1m9zcdz");
    			attr_dev(div16, "contenteditable", "true");
    			if (/*file*/ ctx[0].content === void 0) add_render_callback(() => /*div16_input_handler*/ ctx[15].call(div16));
    			add_location(div16, file_1, 564, 20, 19134);
    			attr_dev(div17, "class", "details-wrap svelte-1m9zcdz");
    			add_location(div17, file_1, 492, 16, 14554);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, img);
    			/*img_binding*/ ctx[14](img);
    			append_dev(div0, t1);
    			if_block1.m(div0, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div17, anchor);
    			append_dev(div17, div2);
    			append_dev(div2, h50);
    			append_dev(div17, t4);
    			append_dev(div17, div14);
    			append_dev(div14, div5);
    			append_dev(div5, div3);
    			append_dev(div3, h51);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, h52);
    			append_dev(h52, t7);
    			append_dev(h52, t8);
    			append_dev(div14, t9);
    			append_dev(div14, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h53);
    			append_dev(div8, t11);
    			append_dev(div8, div7);
    			append_dev(div7, h54);
    			append_dev(h54, t12);
    			append_dev(h54, t13);
    			append_dev(div14, t14);
    			append_dev(div14, div11);
    			append_dev(div11, div9);
    			append_dev(div9, h55);
    			append_dev(div11, t16);
    			append_dev(div11, div10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div10, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div10, null);
    			}

    			append_dev(div14, t17);
    			append_dev(div14, div12);
    			if_block2.m(div12, null);
    			append_dev(div14, t18);
    			append_dev(div14, div13);
    			if_block3.m(div13, null);
    			append_dev(div17, t19);
    			append_dev(div17, div15);
    			append_dev(div15, h56);
    			append_dev(div17, t21);
    			append_dev(div17, div16);

    			if (/*file*/ ctx[0].content !== void 0) {
    				div16.innerHTML = /*file*/ ctx[0].content;
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "mouseover", /*hoverHandle*/ ctx[7], false, false, false),
    					listen_dev(div16, "input", /*div16_input_handler*/ ctx[15])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*img_hover*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*curr*/ 2 && !src_url_equal(img.src, img_src_value = /*curr*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			}

    			if (dirty & /*file*/ 1 && t8_value !== (t8_value = /*file*/ ctx[0].location + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*file*/ 1 && t13_value !== (t13_value = /*file*/ ctx[0].associate + "")) set_data_dev(t13, t13_value);

    			if (dirty & /*file*/ 1) {
    				each_value = /*file*/ ctx[0].attendee;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div10, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block_2(ctx);
    					each_1_else.c();
    					each_1_else.m(div10, null);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}

    			if (current_block_type_1 !== (current_block_type_1 = select_block_type_3(ctx))) {
    				if_block2.d(1);
    				if_block2 = current_block_type_1(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div12, null);
    				}
    			}

    			if (current_block_type_2 !== (current_block_type_2 = select_block_type_4(ctx))) {
    				if_block3.d(1);
    				if_block3 = current_block_type_2(ctx);

    				if (if_block3) {
    					if_block3.c();
    					if_block3.m(div13, null);
    				}
    			}

    			if (dirty & /*file*/ 1 && /*file*/ ctx[0].content !== div16.innerHTML) {
    				div16.innerHTML = /*file*/ ctx[0].content;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			/*img_binding*/ ctx[14](null);
    			if_block1.d();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div17);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    			if_block2.d();
    			if_block3.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(464:16) {#if status == 0}",
    		ctx
    	});

    	return block;
    }

    // (467:24) {#if img_hover}
    function create_if_block_5(ctx) {
    	let div2;
    	let div0;
    	let svg0;
    	let path0;
    	let t;
    	let div1;
    	let svg1;
    	let path1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t = space();
    			div1 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "d", "M15.75 19.5L8.25 12l7.5-7.5");
    			add_location(path0, file_1, 470, 36, 13310);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-width", "2");
    			attr_dev(svg0, "stroke", "white");
    			attr_dev(svg0, "height", "60");
    			attr_dev(svg0, "width", "60");
    			add_location(svg0, file_1, 469, 32, 13145);
    			attr_dev(div0, "class", "left-arrow-wrap");
    			add_location(div0, file_1, 468, 28, 13053);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "d", "M8.25 4.5l7.5 7.5-7.5 7.5");
    			add_location(path1, file_1, 475, 36, 13762);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "2");
    			attr_dev(svg1, "stroke", "white");
    			attr_dev(svg1, "height", "60");
    			attr_dev(svg1, "width", "60");
    			add_location(svg1, file_1, 474, 32, 13597);
    			attr_dev(div1, "class", "right-arrow-wrap");
    			add_location(div1, file_1, 473, 28, 13503);
    			attr_dev(div2, "class", "facad svelte-1m9zcdz");
    			add_location(div2, file_1, 467, 24, 13004);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			append_dev(div1, svg1);
    			append_dev(svg1, path1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*imageNavigateBack*/ ctx[9], false, false, false),
    					listen_dev(div1, "click", /*imageNavigateForth*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(467:24) {#if img_hover}",
    		ctx
    	});

    	return block;
    }

    // (487:24) {:else}
    function create_else_block_3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "caption-placeholder svelte-1m9zcdz");
    			add_location(div, file_1, 487, 28, 14412);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(487:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (483:24) {#if img_hover}
    function create_if_block_4(ctx) {
    	let div;
    	let h4;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			t = text(/*name*/ ctx[4]);
    			attr_dev(h4, "class", "svelte-1m9zcdz");
    			add_location(h4, file_1, 484, 32, 14298);
    			attr_dev(div, "class", "caption svelte-1m9zcdz");
    			add_location(div, file_1, 483, 28, 14243);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(h4, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 16) set_data_dev(t, /*name*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(483:24) {#if img_hover}",
    		ctx
    	});

    	return block;
    }

    // (522:32) {:else}
    function create_else_block_2(ctx) {
    	let h4;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "주요 참석자가 없습니다.";
    			add_location(h4, file_1, 522, 36, 16047);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(522:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (520:32) {#each file.attendee as attendee, index}
    function create_each_block$1(ctx) {
    	let h5;
    	let t0;
    	let t1_value = /*attendee*/ ctx[20] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			t0 = text("#");
    			t1 = text(t1_value);
    			add_location(h5, file_1, 520, 36, 15948);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			append_dev(h5, t0);
    			append_dev(h5, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*file*/ 1 && t1_value !== (t1_value = /*attendee*/ ctx[20] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(520:32) {#each file.attendee as attendee, index}",
    		ctx
    	});

    	return block;
    }

    // (535:28) {:else}
    function create_else_block_1(ctx) {
    	let h5;
    	let svg;
    	let path;
    	let t;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t = text("\r\n                                    본 기록물은 생산되었습니다.");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z");
    			add_location(path, file_1, 537, 40, 17161);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "black");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "class", "svelte-1m9zcdz");
    			add_location(svg, file_1, 536, 36, 16992);
    			attr_dev(h5, "class", "svelte-1m9zcdz");
    			add_location(h5, file_1, 535, 32, 16950);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			append_dev(h5, svg);
    			append_dev(svg, path);
    			append_dev(h5, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(535:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (528:28) {#if file.collected}
    function create_if_block_3(ctx) {
    	let h5;
    	let svg;
    	let path;
    	let t;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t = text("\r\n                                    본 기록물은 수집되었습니다.");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z");
    			add_location(path, file_1, 530, 40, 16537);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "black");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "class", "svelte-1m9zcdz");
    			add_location(svg, file_1, 529, 36, 16368);
    			attr_dev(h5, "class", "svelte-1m9zcdz");
    			add_location(h5, file_1, 528, 32, 16326);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			append_dev(h5, svg);
    			append_dev(svg, path);
    			append_dev(h5, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(528:28) {#if file.collected}",
    		ctx
    	});

    	return block;
    }

    // (552:28) {:else}
    function create_else_block$2(ctx) {
    	let h5;
    	let svg;
    	let path;
    	let t;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t = text("\r\n                                    본 기록물은 또한 공개 기록물입니다.");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z");
    			add_location(path, file_1, 554, 40, 18555);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "black");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "class", "svelte-1m9zcdz");
    			add_location(svg, file_1, 553, 36, 18386);
    			attr_dev(h5, "class", "svelte-1m9zcdz");
    			add_location(h5, file_1, 552, 32, 18344);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			append_dev(h5, svg);
    			append_dev(svg, path);
    			append_dev(h5, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(552:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (545:28) {#if file.private}
    function create_if_block_2(ctx) {
    	let h5;
    	let svg;
    	let path;
    	let t;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t = text("\r\n                                    본 기록물은 또한 비공개 기록물입니다.");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z");
    			add_location(path, file_1, 547, 40, 17925);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "black");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "class", "svelte-1m9zcdz");
    			add_location(svg, file_1, 546, 36, 17756);
    			attr_dev(h5, "class", "svelte-1m9zcdz");
    			add_location(h5, file_1, 545, 32, 17714);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			append_dev(h5, svg);
    			append_dev(svg, path);
    			append_dev(h5, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(545:28) {#if file.private}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div3;
    	let div1;
    	let div0;
    	let button;
    	let svg;
    	let path;
    	let t0;
    	let promise;
    	let t1;
    	let t2;
    	let div2;
    	let mounted;
    	let dispose;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 23,
    		error: 24
    	};

    	handle_promise(promise = /*getDataFromId*/ ctx[11](/*file_id*/ ctx[5]), info);
    	let if_block0 = /*status*/ ctx[6] == 1 && create_if_block_7(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*user*/ ctx[12].authority) return create_if_block$3;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			info.block.c();
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			div2 = element("div");
    			if_block1.c();
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3");
    			add_location(path, file_1, 390, 20, 8423);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "class", "w-6 h-6");
    			attr_dev(svg, "height", "18");
    			attr_dev(svg, "width", "18");
    			add_location(svg, file_1, 389, 16, 8251);
    			attr_dev(button, "class", "back-btn svelte-1m9zcdz");
    			add_location(button, file_1, 388, 12, 8187);
    			attr_dev(div0, "class", "back-btn-wrap svelte-1m9zcdz");
    			add_location(div0, file_1, 387, 8, 8146);
    			attr_dev(div1, "class", "header svelte-1m9zcdz");
    			add_location(div1, file_1, 386, 4, 8116);
    			attr_dev(div2, "class", "body svelte-1m9zcdz");
    			add_location(div2, file_1, 459, 4, 12645);
    			attr_dev(div3, "class", "focus svelte-1m9zcdz");
    			add_location(div3, file_1, 385, 0, 8091);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(div1, t0);
    			info.block.m(div1, info.anchor = null);
    			info.mount = () => div1;
    			info.anchor = t1;
    			append_dev(div1, t1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			if_block1.m(div2, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*undoFocus*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    			if (/*status*/ ctx[6] == 1) if_block0.p(ctx, dirty);
    			if_block1.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			transition_in(info.block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			info.block.d();
    			info.token = null;
    			info = null;
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContentView', slots, []);
    	let { file } = $$props;
    	const route = O();
    	let file_id = route.params._id;
    	let img_hover = false;
    	let curr;
    	let status = 0;
    	curr = getPhotoFromFront();
    	console.log(curr);
    	var dispatch = createEventDispatcher();

    	function hoverHandle() {
    		$$invalidate(3, img_hover = true);

    		setTimeout(
    			() => {
    				if (img_hover) {
    					$$invalidate(3, img_hover = false);
    				}
    			},
    			4000
    		);
    	}

    	function undoFocus() {
    		dispatch('escape', { focus: null });
    		f.goto('/manage/cases');
    	}

    	/* copies file.src into fileLst */
    	function getPhotoFromFront() {
    		if (file) {
    			let result = file.src.shift();
    			$$invalidate(0, file.src = [...file.src, result], file);
    			return result;
    		} else {
    			console.log("No file object detected");
    		}
    	}

    	function getPhotoFromBack() {
    		if (file) {
    			let result = file.src.pop();
    			$$invalidate(0, file.src = [result, ...file.src], file);
    			return result;
    		} else {
    			console.log("No file object detected");
    		}
    	}

    	function imageNavigateBack() {
    		$$invalidate(1, curr = getPhotoFromBack());
    	}

    	function imageNavigateForth() {
    		$$invalidate(1, curr = getPhotoFromFront());
    	}

    	async function getDataFromId(id) {
    		$$invalidate(0, file = await axios$1.get(`http://localhost:4000/browse/${id}`));
    		return file;
    	}

    	/* Test variables to be fetched from server when online */
    	/* USER object:
            @authority - Show the contents to authorized personal only. 
                         Set false at default.
            @name      - Name of the logged in user.  
    */
    	let user = { authority: true, name: "Kim" };

    	let image;
    	let source;
    	let name;

    	file = {
    		type: 'photos',
    		_id: 1,
    		uploader_id: 2,
    		associate: "김재우",
    		location: "학술정보원",
    		collected: true,
    		private: false,
    		attendee: ["교장", "부교장", "대통령", "국방부장관", "생도"],
    		created_at: "22년 2월 3일",
    		title: "이인호 동상 앞에서",
    		src: ["/public/main_page_bg.JPG", "/public/nama_logo.png", "/public/navy-logo.JPG"],
    		content: "<h4>This is sample content of the post.<h4>"
    	};

    	const writable_props = ['file'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<ContentView> was created with unknown prop '${key}'`);
    	});

    	function img_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			image = $$value;
    			(($$invalidate(2, image), $$invalidate(1, curr)), $$invalidate(13, source));
    		});
    	}

    	function div16_input_handler() {
    		file.content = this.innerHTML;
    		$$invalidate(0, file);
    	}

    	$$self.$$set = $$props => {
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    	};

    	$$self.$capture_state = () => ({
    		Route,
    		meta: O,
    		router: f,
    		axios: axios$1,
    		draw,
    		fade,
    		createEventDispatcher,
    		onMount,
    		file,
    		route,
    		file_id,
    		img_hover,
    		curr,
    		status,
    		dispatch,
    		hoverHandle,
    		undoFocus,
    		getPhotoFromFront,
    		getPhotoFromBack,
    		imageNavigateBack,
    		imageNavigateForth,
    		getDataFromId,
    		user,
    		image,
    		source,
    		name
    	});

    	$$self.$inject_state = $$props => {
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    		if ('file_id' in $$props) $$invalidate(5, file_id = $$props.file_id);
    		if ('img_hover' in $$props) $$invalidate(3, img_hover = $$props.img_hover);
    		if ('curr' in $$props) $$invalidate(1, curr = $$props.curr);
    		if ('status' in $$props) $$invalidate(6, status = $$props.status);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('user' in $$props) $$invalidate(12, user = $$props.user);
    		if ('image' in $$props) $$invalidate(2, image = $$props.image);
    		if ('source' in $$props) $$invalidate(13, source = $$props.source);
    		if ('name' in $$props) $$invalidate(4, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*image, curr, source*/ 8198) {
    			 {
    				if (image) {
    					$$invalidate(13, source = curr.split('/'));
    					$$invalidate(4, name = source.pop());

    					if (image.offsetHeight > image.offsetWidth) {
    						$$invalidate(2, image.height = 450, image);
    					} else {
    						$$invalidate(2, image.width = 450, image);
    					}
    				}
    			}
    		}
    	};

    	return [
    		file,
    		curr,
    		image,
    		img_hover,
    		name,
    		file_id,
    		status,
    		hoverHandle,
    		undoFocus,
    		imageNavigateBack,
    		imageNavigateForth,
    		getDataFromId,
    		user,
    		source,
    		img_binding,
    		div16_input_handler
    	];
    }

    class ContentView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { file: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContentView",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*file*/ ctx[0] === undefined && !('file' in props)) {
    			console_1$1.warn("<ContentView> was created without expected prop 'file'");
    		}
    	}

    	get file() {
    		throw new Error("<ContentView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set file(value) {
    		throw new Error("<ContentView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* pages/content_container/ContentContainer.svelte generated by Svelte v3.50.1 */
    const file$7 = "pages/content_container/ContentContainer.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (109:4) <Route path="/:_id">
    function create_default_slot(ctx) {
    	let contentview;
    	let current;

    	contentview = new ContentView({
    			props: { file: /*focus*/ ctx[0] },
    			$$inline: true
    		});

    	contentview.$on("escape", /*undoFocus*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(contentview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contentview_changes = {};
    			if (dirty & /*focus*/ 1) contentview_changes.file = /*focus*/ ctx[0];
    			contentview.$set(contentview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contentview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contentview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contentview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(109:4) <Route path=\\\"/:_id\\\">",
    		ctx
    	});

    	return block;
    }

    // (113:8) {#each curr_page_items as item, index}
    function create_each_block$2(ctx) {
    	let contentitem;
    	let current;

    	contentitem = new ContentItem({
    			props: { item: /*item*/ ctx[8] },
    			$$inline: true
    		});

    	contentitem.$on("click", /*passFocus*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(contentitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contentitem_changes = {};
    			if (dirty & /*curr_page_items*/ 2) contentitem_changes.item = /*item*/ ctx[8];
    			contentitem.$set(contentitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contentitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contentitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contentitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(113:8) {#each curr_page_items as item, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div1;
    	let route;
    	let t;
    	let div0;
    	let current;

    	route = new Route({
    			props: {
    				path: "/:_id",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*curr_page_items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(route.$$.fragment);
    			t = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "browse-contents-list-view svelte-180qlpv");
    			add_location(div0, file$7, 111, 4, 2982);
    			attr_dev(div1, "class", "browse-content-container svelte-180qlpv");
    			add_location(div1, file$7, 107, 0, 2843);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(route, div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route_changes = {};

    			if (dirty & /*$$scope, focus*/ 2049) {
    				route_changes.$$scope = { dirty, ctx };
    			}

    			route.$set(route_changes);

    			if (dirty & /*curr_page_items, passFocus*/ 6) {
    				each_value = /*curr_page_items*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(route);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let curr_page_items;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContentContainer', slots, []);
    	let { page = 1 } = $$props;
    	var dispatch = createEventDispatcher();
    	let focus = null;
    	let fetched_items = [];

    	function passFocus(e) {
    		$$invalidate(0, focus = e.detail.item);
    		dispatch('focus', { focus: true });
    		f.goto(`/manage/cases/browse/${focus._id}`);
    	}

    	function undoFocus() {
    		$$invalidate(0, focus = null);
    		dispatch('focus', { focus: false });
    	}

    	/* Test variables to be fetched from server when online */
    	/* USER object:
            @authority - Show the contents to authorized personal only. 
                         Set false at default.
            @name      - Name of the logged in user.  
    */
    	let user = { authority: true, name: "Kim" };

    	for (let i = 0; i < 40; i++) {
    		fetched_items = [
    			...fetched_items,
    			{
    				type: 'photos',
    				_id: i,
    				uploader_id: 2,
    				associate: "김재우",
    				location: "학술정보원",
    				collected: true,
    				private: false,
    				attendee: ["교장", "부교장", "대통령", "국방부장관", "생도"],
    				created_at: "22년 2월 3일",
    				title: "이인호 동상 앞에서",
    				src: [
    					"/public/main_page_bg.JPG",
    					"/public/nama_logo.png",
    					"/public/navy-logo.JPG"
    				],
    				content: "<h4>This is sample content of the post.<h4>"
    			}
    		];
    	}

    	const writable_props = ['page'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContentContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('page' in $$props) $$invalidate(4, page = $$props.page);
    	};

    	$$self.$capture_state = () => ({
    		Route,
    		meta: O,
    		router: f,
    		draw,
    		fade,
    		createEventDispatcher,
    		ContentItem,
    		ContentView,
    		page,
    		dispatch,
    		focus,
    		fetched_items,
    		passFocus,
    		undoFocus,
    		user,
    		curr_page_items
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(4, page = $$props.page);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('focus' in $$props) $$invalidate(0, focus = $$props.focus);
    		if ('fetched_items' in $$props) $$invalidate(5, fetched_items = $$props.fetched_items);
    		if ('user' in $$props) user = $$props.user;
    		if ('curr_page_items' in $$props) $$invalidate(1, curr_page_items = $$props.curr_page_items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*fetched_items, page*/ 48) {
    			 $$invalidate(1, curr_page_items = fetched_items.slice((page - 1) * 12, page * 12));
    		}
    	};

    	return [focus, curr_page_items, passFocus, undoFocus, page, fetched_items];
    }

    class ContentContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { page: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContentContainer",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get page() {
    		throw new Error("<ContentContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<ContentContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* pages/sidebar/BrowseNavbar.svelte generated by Svelte v3.50.1 */
    const file$8 = "pages/sidebar/BrowseNavbar.svelte";

    // (139:4) {#if !focus}
    function create_if_block$4(ctx) {
    	let t0;
    	let div0;
    	let usersearch;
    	let t1;
    	let div1;
    	let button;
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*page*/ ctx[0] != 1 && create_if_block_1$2(ctx);
    	usersearch = new UserSearch({ $$inline: true });

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div0 = element("div");
    			create_component(usersearch.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(div0, "class", "search-panel-wrap svelte-1crfji7");
    			add_location(div0, file$8, 149, 8, 3523);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M8.25 4.5l7.5 7.5-7.5 7.5");
    			add_location(path, file$8, 156, 20, 3887);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2.5");
    			attr_dev(svg, "stroke", "white");
    			attr_dev(svg, "class", "right-svg svelte-1crfji7");
    			attr_dev(svg, "width", "19");
    			attr_dev(svg, "height", "19");
    			add_location(svg, file$8, 155, 16, 3718);
    			attr_dev(button, "class", "go-forth svelte-1crfji7");
    			add_location(button, file$8, 154, 12, 3651);
    			attr_dev(div1, "class", "go-forth-wrap svelte-1crfji7");
    			add_location(div1, file$8, 153, 8, 3610);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			mount_component(usersearch, div0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*pageIncrease*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*page*/ ctx[0] != 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usersearch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usersearch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			destroy_component(usersearch);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(139:4) {#if !focus}",
    		ctx
    	});

    	return block;
    }

    // (140:8) {#if page != 1}
    function create_if_block_1$2(ctx) {
    	let div;
    	let button;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M15.75 19.5L8.25 12l7.5-7.5");
    			add_location(path, file$8, 143, 24, 3334);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2.5");
    			attr_dev(svg, "stroke", "white");
    			attr_dev(svg, "class", "left-svg svelte-1crfji7");
    			attr_dev(svg, "width", "19");
    			attr_dev(svg, "height", "19");
    			add_location(svg, file$8, 142, 20, 3162);
    			attr_dev(button, "class", "go-back svelte-1crfji7");
    			add_location(button, file$8, 141, 16, 3092);
    			attr_dev(div, "class", "go-back-wrap svelte-1crfji7");
    			add_location(div, file$8, 140, 12, 3048);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*pageDecrease*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(140:8) {#if page != 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let current;
    	let if_block = !/*focus*/ ctx[1] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "browse-navbar-wrap svelte-1crfji7");
    			add_location(div, file$8, 137, 0, 2959);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*focus*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*focus*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BrowseNavbar', slots, []);
    	var dispatch = createEventDispatcher();
    	let { page = 1 } = $$props;
    	let { focus = false } = $$props;

    	function pageIncrease() {
    		$$invalidate(0, page += 1);
    		dispatch('pageChange', { page });
    	}

    	function pageDecrease() {
    		if (page != 1) {
    			$$invalidate(0, page -= 1);
    			dispatch('pageChange', { page });
    		}
    	}

    	const writable_props = ['page', 'focus'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BrowseNavbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    		if ('focus' in $$props) $$invalidate(1, focus = $$props.focus);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		UserSearch,
    		dispatch,
    		page,
    		focus,
    		pageIncrease,
    		pageDecrease
    	});

    	$$self.$inject_state = $$props => {
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    		if ('focus' in $$props) $$invalidate(1, focus = $$props.focus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [page, focus, pageIncrease, pageDecrease];
    }

    class BrowseNavbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { page: 0, focus: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BrowseNavbar",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get page() {
    		throw new Error("<BrowseNavbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<BrowseNavbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		throw new Error("<BrowseNavbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focus(value) {
    		throw new Error("<BrowseNavbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* pages/Browse.svelte generated by Svelte v3.50.1 */
    const file$9 = "pages/Browse.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (88:16) {:else}
    function create_else_block$3(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "비어있음";
    			add_location(h3, file$9, 88, 20, 2007);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(88:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (86:16) {#each categories as category, index}
    function create_each_block$3(ctx) {
    	let category;
    	let current;

    	category = new Category({
    			props: {
    				category: /*category*/ ctx[7],
    				index: /*index*/ ctx[9],
    				selected_index: /*selected_index*/ ctx[0]
    			},
    			$$inline: true
    		});

    	category.$on("click", /*categorySelect*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(category.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(category, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const category_changes = {};
    			if (dirty & /*selected_index*/ 1) category_changes.selected_index = /*selected_index*/ ctx[0];
    			category.$set(category_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(category.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(category.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(category, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(86:16) {#each categories as category, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div4;
    	let div3;
    	let div1;
    	let div0;
    	let t0;
    	let div2;
    	let contentcontainer;
    	let t1;
    	let browsenavbar;
    	let current;
    	let each_value = /*categories*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$3(ctx);
    	}

    	contentcontainer = new ContentContainer({
    			props: { page: /*page*/ ctx[1] },
    			$$inline: true
    		});

    	contentcontainer.$on("pageChange", /*pageHandle*/ ctx[5]);
    	contentcontainer.$on("focus", /*focusHandle*/ ctx[6]);

    	browsenavbar = new BrowseNavbar({
    			props: {
    				page: /*page*/ ctx[1],
    				focus: /*focus*/ ctx[2]
    			},
    			$$inline: true
    		});

    	browsenavbar.$on("pageChange", /*pageHandle*/ ctx[5]);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			t0 = space();
    			div2 = element("div");
    			create_component(contentcontainer.$$.fragment);
    			t1 = space();
    			create_component(browsenavbar.$$.fragment);
    			attr_dev(div0, "class", "browse-control-container svelte-7d4dsw");
    			add_location(div0, file$9, 84, 12, 1746);
    			attr_dev(div1, "class", "browse-control-wrap svelte-7d4dsw");
    			add_location(div1, file$9, 83, 8, 1700);
    			attr_dev(div2, "class", "browse-content-wrap svelte-7d4dsw");
    			add_location(div2, file$9, 93, 8, 2096);
    			attr_dev(div3, "class", "browse-main-container svelte-7d4dsw");
    			add_location(div3, file$9, 82, 4, 1656);
    			attr_dev(div4, "class", "browse-main-wrap svelte-7d4dsw");
    			add_location(div4, file$9, 81, 0, 1621);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div0, null);
    			}

    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			mount_component(contentcontainer, div2, null);
    			append_dev(div2, t1);
    			mount_component(browsenavbar, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*categories, selected_index, categorySelect*/ 25) {
    				each_value = /*categories*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block$3(ctx);
    					each_1_else.c();
    					each_1_else.m(div0, null);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}

    			const contentcontainer_changes = {};
    			if (dirty & /*page*/ 2) contentcontainer_changes.page = /*page*/ ctx[1];
    			contentcontainer.$set(contentcontainer_changes);
    			const browsenavbar_changes = {};
    			if (dirty & /*page*/ 2) browsenavbar_changes.page = /*page*/ ctx[1];
    			if (dirty & /*focus*/ 4) browsenavbar_changes.focus = /*focus*/ ctx[2];
    			browsenavbar.$set(browsenavbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(contentcontainer.$$.fragment, local);
    			transition_in(browsenavbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(contentcontainer.$$.fragment, local);
    			transition_out(browsenavbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    			destroy_component(contentcontainer);
    			destroy_component(browsenavbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Browse', slots, []);
    	let categories = ["영상", "사진", "문서"];
    	let selected_index = null;
    	let page = 1;
    	let focus = false;

    	function categorySelect(e) {
    		$$invalidate(0, selected_index = e.detail.index);
    	}

    	function pageHandle(e) {
    		$$invalidate(1, page = e.detail.page);
    	}

    	function focusHandle(e) {
    		$$invalidate(2, focus = e.detail.focus);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Browse> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Category,
    		ContentContainer,
    		BrowseNavbar,
    		meta: O,
    		Route,
    		categories,
    		selected_index,
    		page,
    		focus,
    		categorySelect,
    		pageHandle,
    		focusHandle
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) $$invalidate(3, categories = $$props.categories);
    		if ('selected_index' in $$props) $$invalidate(0, selected_index = $$props.selected_index);
    		if ('page' in $$props) $$invalidate(1, page = $$props.page);
    		if ('focus' in $$props) $$invalidate(2, focus = $$props.focus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selected_index,
    		page,
    		focus,
    		categories,
    		categorySelect,
    		pageHandle,
    		focusHandle
    	];
    }

    class Browse extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Browse",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* components/Search.svelte generated by Svelte v3.50.1 */

    const file$a = "components/Search.svelte";

    function create_fragment$c(ctx) {
    	let div17;
    	let div0;
    	let h30;
    	let t1;
    	let div3;
    	let div1;
    	let svg0;
    	let path0;
    	let t2;
    	let div2;
    	let input;
    	let t3;
    	let div4;
    	let svg1;
    	let path1;
    	let t4;
    	let div5;
    	let svg2;
    	let path2;
    	let t5;
    	let div6;
    	let svg3;
    	let path3;
    	let t6;
    	let div8;
    	let div7;
    	let h31;
    	let t8;
    	let div10;
    	let div9;
    	let h32;
    	let t10;
    	let div12;
    	let div11;
    	let h33;
    	let t12;
    	let div14;
    	let div13;
    	let h34;
    	let t14;
    	let div16;
    	let div15;
    	let h35;

    	const block = {
    		c: function create() {
    			div17 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			h30.textContent = "전체선택";
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t2 = space();
    			div2 = element("div");
    			input = element("input");
    			t3 = space();
    			div4 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t4 = space();
    			div5 = element("div");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t5 = space();
    			div6 = element("div");
    			svg3 = svg_element("svg");
    			path3 = svg_element("path");
    			t6 = space();
    			div8 = element("div");
    			div7 = element("div");
    			h31 = element("h3");
    			h31.textContent = "인물";
    			t8 = space();
    			div10 = element("div");
    			div9 = element("div");
    			h32 = element("h3");
    			h32.textContent = "제목";
    			t10 = space();
    			div12 = element("div");
    			div11 = element("div");
    			h33 = element("h3");
    			h33.textContent = "장소";
    			t12 = space();
    			div14 = element("div");
    			div13 = element("div");
    			h34 = element("h3");
    			h34.textContent = "최근순";
    			t14 = space();
    			div16 = element("div");
    			div15 = element("div");
    			h35 = element("h3");
    			h35.textContent = "검색";
    			attr_dev(h30, "class", "svelte-jc55ih");
    			add_location(h30, file$a, 95, 12, 1977);
    			attr_dev(div0, "class", "select-all-or-reset svelte-jc55ih");
    			add_location(div0, file$a, 94, 8, 1931);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "d", "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z");
    			add_location(path0, file$a, 102, 22, 2309);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-width", "1.5");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "class", "w-6 h-6");
    			attr_dev(svg0, "height", "25px");
    			attr_dev(svg0, "width", "25px");
    			add_location(svg0, file$a, 101, 16, 2130);
    			attr_dev(div1, "class", "search-icon-wrap svelte-jc55ih");
    			add_location(div1, file$a, 100, 12, 2083);
    			attr_dev(input, "class", "search-input svelte-jc55ih");
    			add_location(input, file$a, 106, 16, 2539);
    			attr_dev(div2, "class", "search-bar svelte-jc55ih");
    			add_location(div2, file$a, 105, 12, 2498);
    			attr_dev(div3, "class", "search-panel svelte-jc55ih");
    			add_location(div3, file$a, 99, 8, 2044);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "d", "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z");
    			add_location(path1, file$a, 112, 18, 2820);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "1");
    			attr_dev(svg1, "stroke", "#011284");
    			attr_dev(svg1, "class", "w-6 h-6");
    			attr_dev(svg1, "height", "30px");
    			attr_dev(svg1, "width", "30px");
    			attr_dev(svg1, "fill", "none");
    			add_location(svg1, file$a, 111, 12, 2652);
    			attr_dev(div4, "class", "select svelte-jc55ih");
    			add_location(div4, file$a, 110, 8, 2619);
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "d", "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z");
    			add_location(path2, file$a, 118, 18, 3303);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "stroke-width", "1");
    			attr_dev(svg2, "stroke", "#011284");
    			attr_dev(svg2, "class", "w-6 h-6");
    			attr_dev(svg2, "height", "30px");
    			attr_dev(svg2, "width", "30px");
    			attr_dev(svg2, "fill", "none");
    			add_location(svg2, file$a, 117, 12, 3135);
    			attr_dev(div5, "class", "select svelte-jc55ih");
    			add_location(div5, file$a, 116, 8, 3102);
    			attr_dev(path3, "stroke-linecap", "round");
    			attr_dev(path3, "stroke-linejoin", "round");
    			attr_dev(path3, "d", "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z");
    			add_location(path3, file$a, 124, 2, 3897);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "viewBox", "0 0 24 24");
    			attr_dev(svg3, "stroke-width", "1");
    			attr_dev(svg3, "stroke", "#011284");
    			attr_dev(svg3, "class", "w-6 h-6");
    			attr_dev(svg3, "height", "30px");
    			attr_dev(svg3, "width", "30px");
    			attr_dev(svg3, "fill", "none");
    			add_location(svg3, file$a, 123, 12, 3745);
    			attr_dev(div6, "class", "select svelte-jc55ih");
    			add_location(div6, file$a, 122, 8, 3712);
    			attr_dev(h31, "class", "svelte-jc55ih");
    			add_location(h31, file$a, 130, 16, 4328);
    			attr_dev(div7, "class", "btn svelte-jc55ih");
    			add_location(div7, file$a, 129, 12, 4294);
    			attr_dev(div8, "class", "select svelte-jc55ih");
    			add_location(div8, file$a, 128, 8, 4261);
    			attr_dev(h32, "class", "svelte-jc55ih");
    			add_location(h32, file$a, 135, 16, 4449);
    			attr_dev(div9, "class", "btn svelte-jc55ih");
    			add_location(div9, file$a, 134, 12, 4415);
    			attr_dev(div10, "class", "select svelte-jc55ih");
    			add_location(div10, file$a, 133, 8, 4382);
    			attr_dev(h33, "class", "svelte-jc55ih");
    			add_location(h33, file$a, 140, 16, 4570);
    			attr_dev(div11, "class", "btn svelte-jc55ih");
    			add_location(div11, file$a, 139, 12, 4536);
    			attr_dev(div12, "class", "select svelte-jc55ih");
    			add_location(div12, file$a, 138, 8, 4503);
    			attr_dev(h34, "class", "svelte-jc55ih");
    			add_location(h34, file$a, 145, 16, 4691);
    			attr_dev(div13, "class", "btn svelte-jc55ih");
    			add_location(div13, file$a, 144, 12, 4657);
    			attr_dev(div14, "class", "select svelte-jc55ih");
    			add_location(div14, file$a, 143, 8, 4624);
    			attr_dev(h35, "class", "svelte-jc55ih");
    			add_location(h35, file$a, 150, 16, 4820);
    			attr_dev(div15, "class", "search-btn svelte-jc55ih");
    			add_location(div15, file$a, 149, 12, 4779);
    			attr_dev(div16, "class", "select svelte-jc55ih");
    			add_location(div16, file$a, 148, 8, 4746);
    			attr_dev(div17, "class", "search-main svelte-jc55ih");
    			add_location(div17, file$a, 93, 0, 1897);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div17, anchor);
    			append_dev(div17, div0);
    			append_dev(div0, h30);
    			append_dev(div17, t1);
    			append_dev(div17, div3);
    			append_dev(div3, div1);
    			append_dev(div1, svg0);
    			append_dev(svg0, path0);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, input);
    			append_dev(div17, t3);
    			append_dev(div17, div4);
    			append_dev(div4, svg1);
    			append_dev(svg1, path1);
    			append_dev(div17, t4);
    			append_dev(div17, div5);
    			append_dev(div5, svg2);
    			append_dev(svg2, path2);
    			append_dev(div17, t5);
    			append_dev(div17, div6);
    			append_dev(div6, svg3);
    			append_dev(svg3, path3);
    			append_dev(div17, t6);
    			append_dev(div17, div8);
    			append_dev(div8, div7);
    			append_dev(div7, h31);
    			append_dev(div17, t8);
    			append_dev(div17, div10);
    			append_dev(div10, div9);
    			append_dev(div9, h32);
    			append_dev(div17, t10);
    			append_dev(div17, div12);
    			append_dev(div12, div11);
    			append_dev(div11, h33);
    			append_dev(div17, t12);
    			append_dev(div17, div14);
    			append_dev(div14, div13);
    			append_dev(div13, h34);
    			append_dev(div17, t14);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, h35);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div17);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* pages/Info.svelte generated by Svelte v3.50.1 */

    const file$b = "pages/Info.svelte";

    function create_fragment$d(ctx) {
    	let div12;
    	let div3;
    	let div0;
    	let svg0;
    	let path0;
    	let t0;
    	let div2;
    	let div1;
    	let h30;
    	let t2;
    	let h31;
    	let t4;
    	let div7;
    	let div4;
    	let svg1;
    	let path1;
    	let t5;
    	let div6;
    	let div5;
    	let h32;
    	let t7;
    	let h33;
    	let t9;
    	let div11;
    	let div8;
    	let svg2;
    	let path2;
    	let t10;
    	let div10;
    	let div9;
    	let h34;
    	let t12;
    	let h35;

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "3";
    			t2 = space();
    			h31 = element("h3");
    			h31.textContent = "개";
    			t4 = space();
    			div7 = element("div");
    			div4 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t5 = space();
    			div6 = element("div");
    			div5 = element("div");
    			h32 = element("h3");
    			h32.textContent = "3";
    			t7 = space();
    			h33 = element("h3");
    			h33.textContent = "개";
    			t9 = space();
    			div11 = element("div");
    			div8 = element("div");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t10 = space();
    			div10 = element("div");
    			div9 = element("div");
    			h34 = element("h3");
    			h34.textContent = "3";
    			t12 = space();
    			h35 = element("h3");
    			h35.textContent = "개";
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "d", "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z");
    			add_location(path0, file$b, 69, 18, 1427);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-width", "1");
    			attr_dev(svg0, "stroke", "#011284");
    			attr_dev(svg0, "class", "w-6 h-6");
    			attr_dev(svg0, "height", "25px");
    			attr_dev(svg0, "width", "25px");
    			attr_dev(svg0, "fill", "none");
    			add_location(svg0, file$b, 68, 12, 1259);
    			attr_dev(div0, "class", "info-title svelte-mm3wap");
    			add_location(div0, file$b, 67, 8, 1222);
    			attr_dev(h30, "class", "number svelte-mm3wap");
    			add_location(h30, file$b, 74, 16, 1784);
    			attr_dev(div1, "class", "number-container svelte-mm3wap");
    			add_location(div1, file$b, 73, 12, 1737);
    			attr_dev(h31, "class", "count svelte-mm3wap");
    			add_location(h31, file$b, 78, 12, 1879);
    			attr_dev(div2, "class", "statistics svelte-mm3wap");
    			add_location(div2, file$b, 72, 8, 1700);
    			attr_dev(div3, "class", "info-container svelte-mm3wap");
    			add_location(div3, file$b, 66, 4, 1185);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "d", "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z");
    			add_location(path1, file$b, 85, 18, 2181);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "1");
    			attr_dev(svg1, "stroke", "#011284");
    			attr_dev(svg1, "class", "w-6 h-6");
    			attr_dev(svg1, "height", "25px");
    			attr_dev(svg1, "width", "25px");
    			attr_dev(svg1, "fill", "none");
    			add_location(svg1, file$b, 84, 12, 2013);
    			attr_dev(div4, "class", "info-title svelte-mm3wap");
    			add_location(div4, file$b, 83, 8, 1976);
    			attr_dev(h32, "class", "number svelte-mm3wap");
    			add_location(h32, file$b, 90, 16, 2665);
    			attr_dev(div5, "class", "number-container svelte-mm3wap");
    			add_location(div5, file$b, 89, 12, 2618);
    			attr_dev(h33, "class", "count svelte-mm3wap");
    			add_location(h33, file$b, 94, 12, 2760);
    			attr_dev(div6, "class", "statistics svelte-mm3wap");
    			add_location(div6, file$b, 88, 8, 2581);
    			attr_dev(div7, "class", "info-container svelte-mm3wap");
    			add_location(div7, file$b, 82, 4, 1939);
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "d", "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z");
    			add_location(path2, file$b, 101, 2, 3046);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "stroke-width", "1");
    			attr_dev(svg2, "stroke", "#011284");
    			attr_dev(svg2, "class", "w-6 h-6");
    			attr_dev(svg2, "height", "25px");
    			attr_dev(svg2, "width", "25px");
    			attr_dev(svg2, "fill", "none");
    			add_location(svg2, file$b, 100, 12, 2894);
    			attr_dev(div8, "class", "info-title svelte-mm3wap");
    			add_location(div8, file$b, 99, 8, 2857);
    			attr_dev(h34, "class", "number svelte-mm3wap");
    			add_location(h34, file$b, 106, 16, 3485);
    			attr_dev(div9, "class", "number-container svelte-mm3wap");
    			add_location(div9, file$b, 105, 12, 3438);
    			attr_dev(h35, "class", "count svelte-mm3wap");
    			add_location(h35, file$b, 110, 12, 3580);
    			attr_dev(div10, "class", "statistics svelte-mm3wap");
    			add_location(div10, file$b, 104, 8, 3401);
    			attr_dev(div11, "class", "info-container svelte-mm3wap");
    			add_location(div11, file$b, 98, 4, 2820);
    			attr_dev(div12, "class", "info-wrap svelte-mm3wap");
    			add_location(div12, file$b, 64, 0, 1156);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div3);
    			append_dev(div3, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h30);
    			append_dev(div2, t2);
    			append_dev(div2, h31);
    			append_dev(div12, t4);
    			append_dev(div12, div7);
    			append_dev(div7, div4);
    			append_dev(div4, svg1);
    			append_dev(svg1, path1);
    			append_dev(div7, t5);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, h32);
    			append_dev(div6, t7);
    			append_dev(div6, h33);
    			append_dev(div12, t9);
    			append_dev(div12, div11);
    			append_dev(div11, div8);
    			append_dev(div8, svg2);
    			append_dev(svg2, path2);
    			append_dev(div11, t10);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, h34);
    			append_dev(div10, t12);
    			append_dev(div10, h35);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Info', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Info extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* pages/ManageMain.svelte generated by Svelte v3.50.1 */
    const file$c = "pages/ManageMain.svelte";

    function create_fragment$e(ctx) {
    	let div2;
    	let div0;
    	let search;
    	let t;
    	let div1;
    	let info;
    	let current;
    	search = new Search({ $$inline: true });
    	info = new Info({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(search.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(info.$$.fragment);
    			attr_dev(div0, "class", "search-wrap svelte-1jsj0ik");
    			add_location(div0, file$c, 43, 8, 777);
    			attr_dev(div1, "class", "info-wrap svelte-1jsj0ik");
    			add_location(div1, file$c, 46, 8, 852);
    			attr_dev(div2, "class", "main-view-home svelte-1jsj0ik");
    			add_location(div2, file$c, 42, 4, 739);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(search, div0, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			mount_component(info, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search.$$.fragment, local);
    			transition_in(info.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search.$$.fragment, local);
    			transition_out(info.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(search);
    			destroy_component(info);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ManageMain', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ManageMain> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Route, Search, Info });
    	return [];
    }

    class ManageMain extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ManageMain",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* components/manager/InputSingleValue.svelte generated by Svelte v3.50.1 */
    const file$d = "components/manager/InputSingleValue.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    // (207:12) {:else}
    function create_else_block$4(ctx) {
    	let label;
    	let h3;
    	let t;
    	let label_intro;
    	let label_outro;
    	let current;

    	const block = {
    		c: function create() {
    			label = element("label");
    			h3 = element("h3");
    			t = text(/*placeholder*/ ctx[0]);
    			attr_dev(h3, "class", "svelte-4m851m");
    			add_location(h3, file$d, 211, 27, 4900);
    			attr_dev(label, "for", "input");
    			attr_dev(label, "class", "label svelte-4m851m");
    			add_location(label, file$d, 208, 20, 4722);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, h3);
    			append_dev(h3, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*placeholder*/ 1) set_data_dev(t, /*placeholder*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (label_outro) label_outro.end(1);
    				label_intro = create_in_transition(label, /*receive*/ ctx[6], { key: 'unfocused' });
    				label_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (label_intro) label_intro.invalidate();
    			label_outro = create_out_transition(label, /*send*/ ctx[5], { key: 'focused' });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching && label_outro) label_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(207:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (199:12) {#if focused || value}
    function create_if_block_2$1(ctx) {
    	let label;
    	let h3;
    	let t;
    	let label_intro;
    	let label_outro;
    	let current;

    	const block = {
    		c: function create() {
    			label = element("label");
    			h3 = element("h3");
    			t = text(/*placeholder*/ ctx[0]);
    			attr_dev(h3, "class", "svelte-4m851m");
    			add_location(h3, file$d, 203, 27, 4567);
    			attr_dev(label, "for", "input");
    			attr_dev(label, "class", "label-focused svelte-4m851m");
    			add_location(label, file$d, 200, 20, 4381);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, h3);
    			append_dev(h3, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*placeholder*/ 1) set_data_dev(t, /*placeholder*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (label_outro) label_outro.end(1);
    				label_intro = create_in_transition(label, /*receive*/ ctx[6], { key: 'focused' });
    				label_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (label_intro) label_intro.invalidate();
    			label_outro = create_out_transition(label, /*send*/ ctx[5], { key: 'unfocused' });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching && label_outro) label_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(199:12) {#if focused || value}",
    		ctx
    	});

    	return block;
    }

    // (221:16) {#if !con.condition(value)}
    function create_if_block_1$3(ctx) {
    	let h3;
    	let t_value = /*con*/ ctx[12].not_satisfied_text + "";
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(t_value);
    			attr_dev(h3, "class", "not-satisfied svelte-4m851m");
    			add_location(h3, file$d, 221, 20, 5196);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*conditions*/ 2 && t_value !== (t_value = /*con*/ ctx[12].not_satisfied_text + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(221:16) {#if !con.condition(value)}",
    		ctx
    	});

    	return block;
    }

    // (220:12) {#each conditions as con, con_id}
    function create_each_block$4(ctx) {
    	let show_if = !/*con*/ ctx[12].condition(/*value*/ ctx[2]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*conditions, value*/ 6) show_if = !/*con*/ ctx[12].condition(/*value*/ ctx[2]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(220:12) {#each conditions as con, con_id}",
    		ctx
    	});

    	return block;
    }

    // (225:12) {#if condition_result}
    function create_if_block$5(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "좋습니다!";
    			attr_dev(h3, "class", "satisfied svelte-4m851m");
    			add_location(h3, file$d, 225, 16, 5349);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(225:12) {#if condition_result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div3;
    	let div0;
    	let input;
    	let t0;
    	let current_block_type_index;
    	let if_block0;
    	let div0_class_value;
    	let t1;
    	let div2;
    	let div1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_2$1, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*focused*/ ctx[3] || /*value*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let each_value = /*conditions*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	let if_block1 = /*condition_result*/ ctx[4] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			if_block0.c();
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(input, "class", "input svelte-4m851m");
    			attr_dev(input, "type", "text");
    			add_location(input, file$d, 197, 8, 4193);

    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*condition_result*/ ctx[4]
    			? 'input-container'
    			: 'input-container-not-satisfied') + " svelte-4m851m"));

    			add_location(div0, file$d, 196, 4, 4098);
    			attr_dev(div1, "class", "warning-container svelte-4m851m");
    			add_location(div1, file$d, 218, 8, 5051);
    			attr_dev(div2, "class", "warning-wrap svelte-4m851m");
    			add_location(div2, file$d, 217, 4, 5015);
    			attr_dev(div3, "class", "input-wrap svelte-4m851m");
    			add_location(div3, file$d, 195, 0, 4068);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*value*/ ctx[2]);
    			append_dev(div0, t0);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t2);
    			if (if_block1) if_block1.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "focus", /*focusHandle*/ ctx[7], false, false, false),
    					listen_dev(input, "blur", /*blurHandle*/ ctx[8], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 4 && input.value !== /*value*/ ctx[2]) {
    				set_input_value(input, /*value*/ ctx[2]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div0, null);
    			}

    			if (!current || dirty & /*condition_result*/ 16 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*condition_result*/ ctx[4]
    			? 'input-container'
    			: 'input-container-not-satisfied') + " svelte-4m851m"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*conditions, value*/ 6) {
    				each_value = /*conditions*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*condition_result*/ ctx[4]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_blocks[current_block_type_index].d();
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputSingleValue', slots, []);
    	const [send, receive] = crossfade({});
    	var dispatch = createEventDispatcher();
    	let { placeholder = null } = $$props;

    	let { conditions = [
    		{
    			condition: () => {
    				
    			},
    			name: "",
    			not_satisfied_text: "",
    			satisfied_text: ""
    		},
    		{
    			condition: () => {
    				
    			},
    			name: "",
    			not_satisfied_text: "",
    			satisfied_text: ""
    		},
    		{
    			condition: () => {
    				
    			},
    			name: "",
    			not_satisfied_text: "",
    			satisfied_text: ""
    		}
    	] } = $$props;

    	let focused = false;
    	let condition_result = false;
    	let value = '';

    	function focusHandle() {
    		$$invalidate(3, focused = true);
    	}

    	function blurHandle() {
    		$$invalidate(3, focused = false);
    	}

    	function conditionResult(value) {
    		let result = true;

    		conditions.forEach(con => {
    			if (!con.condition(value)) {
    				result = false;
    			}
    		});

    		return result;
    	}

    	const writable_props = ['placeholder', 'conditions'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputSingleValue> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(2, value);
    	}

    	$$self.$$set = $$props => {
    		if ('placeholder' in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ('conditions' in $$props) $$invalidate(1, conditions = $$props.conditions);
    	};

    	$$self.$capture_state = () => ({
    		Route,
    		router: f,
    		createEventDispatcher,
    		crossfade,
    		flip,
    		send,
    		receive,
    		dispatch,
    		placeholder,
    		conditions,
    		focused,
    		condition_result,
    		value,
    		focusHandle,
    		blurHandle,
    		conditionResult
    	});

    	$$self.$inject_state = $$props => {
    		if ('dispatch' in $$props) $$invalidate(10, dispatch = $$props.dispatch);
    		if ('placeholder' in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ('conditions' in $$props) $$invalidate(1, conditions = $$props.conditions);
    		if ('focused' in $$props) $$invalidate(3, focused = $$props.focused);
    		if ('condition_result' in $$props) $$invalidate(4, condition_result = $$props.condition_result);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 4) {
    			 dispatch('change', { value });
    		}

    		if ($$self.$$.dirty & /*value*/ 4) {
    			 {
    				$$invalidate(4, condition_result = conditionResult(value));
    			}
    		}
    	};

    	return [
    		placeholder,
    		conditions,
    		value,
    		focused,
    		condition_result,
    		send,
    		receive,
    		focusHandle,
    		blurHandle,
    		input_input_handler
    	];
    }

    class InputSingleValue extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { placeholder: 0, conditions: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputSingleValue",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get placeholder() {
    		throw new Error("<InputSingleValue>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<InputSingleValue>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get conditions() {
    		throw new Error("<InputSingleValue>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set conditions(value) {
    		throw new Error("<InputSingleValue>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* components/manager/InputMultiValue.svelte generated by Svelte v3.50.1 */

    const { console: console_1$2 } = globals;
    const file$e = "components/manager/InputMultiValue.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (237:12) {:else}
    function create_else_block$5(ctx) {
    	let label;
    	let h3;
    	let t;
    	let label_intro;
    	let label_outro;
    	let current;

    	const block = {
    		c: function create() {
    			label = element("label");
    			h3 = element("h3");
    			t = text(/*placeholder*/ ctx[0]);
    			attr_dev(h3, "class", "svelte-4m851m");
    			add_location(h3, file$e, 241, 27, 5756);
    			attr_dev(label, "for", "input");
    			attr_dev(label, "class", "label svelte-4m851m");
    			add_location(label, file$e, 238, 20, 5578);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, h3);
    			append_dev(h3, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*placeholder*/ 1) set_data_dev(t, /*placeholder*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (label_outro) label_outro.end(1);
    				label_intro = create_in_transition(label, /*receive*/ ctx[6], { key: 'unfocused' });
    				label_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (label_intro) label_intro.invalidate();
    			label_outro = create_out_transition(label, /*send*/ ctx[5], { key: 'focused' });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching && label_outro) label_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(237:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (229:12) {#if focused || value}
    function create_if_block_2$2(ctx) {
    	let label;
    	let h3;
    	let t;
    	let label_intro;
    	let label_outro;
    	let current;

    	const block = {
    		c: function create() {
    			label = element("label");
    			h3 = element("h3");
    			t = text(/*placeholder*/ ctx[0]);
    			attr_dev(h3, "class", "svelte-4m851m");
    			add_location(h3, file$e, 233, 27, 5423);
    			attr_dev(label, "for", "input");
    			attr_dev(label, "class", "label-focused svelte-4m851m");
    			add_location(label, file$e, 230, 20, 5237);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, h3);
    			append_dev(h3, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*placeholder*/ 1) set_data_dev(t, /*placeholder*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (label_outro) label_outro.end(1);
    				label_intro = create_in_transition(label, /*receive*/ ctx[6], { key: 'focused' });
    				label_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (label_intro) label_intro.invalidate();
    			label_outro = create_out_transition(label, /*send*/ ctx[5], { key: 'unfocused' });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching && label_outro) label_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(229:12) {#if focused || value}",
    		ctx
    	});

    	return block;
    }

    // (251:16) {#if !con.condition(value)}
    function create_if_block_1$4(ctx) {
    	let h3;
    	let t_value = /*con*/ ctx[14].not_satisfied_text + "";
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(t_value);
    			attr_dev(h3, "class", "not-satisfied svelte-4m851m");
    			add_location(h3, file$e, 251, 20, 6052);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*conditions*/ 2 && t_value !== (t_value = /*con*/ ctx[14].not_satisfied_text + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(251:16) {#if !con.condition(value)}",
    		ctx
    	});

    	return block;
    }

    // (250:12) {#each conditions as con, con_id}
    function create_each_block$5(ctx) {
    	let show_if = !/*con*/ ctx[14].condition(/*value*/ ctx[3]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*conditions, value*/ 10) show_if = !/*con*/ ctx[14].condition(/*value*/ ctx[3]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(250:12) {#each conditions as con, con_id}",
    		ctx
    	});

    	return block;
    }

    // (255:12) {#if condition_result}
    function create_if_block$6(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "좋습니다!";
    			attr_dev(h3, "class", "satisfied svelte-4m851m");
    			add_location(h3, file$e, 255, 16, 6205);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(255:12) {#if condition_result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div3;
    	let div0;
    	let input;
    	let t0;
    	let current_block_type_index;
    	let if_block0;
    	let div0_class_value;
    	let t1;
    	let div2;
    	let div1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_2$2, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*focused*/ ctx[4] || /*value*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let each_value = /*conditions*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	let if_block1 = /*condition_result*/ ctx[2] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			if_block0.c();
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(input, "class", "input svelte-4m851m");
    			attr_dev(input, "type", "text");
    			add_location(input, file$e, 227, 8, 5049);

    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*condition_result*/ ctx[2]
    			? 'input-container'
    			: 'input-container-not-satisfied') + " svelte-4m851m"));

    			add_location(div0, file$e, 226, 4, 4954);
    			attr_dev(div1, "class", "warning-container svelte-4m851m");
    			add_location(div1, file$e, 248, 8, 5907);
    			attr_dev(div2, "class", "warning-wrap svelte-4m851m");
    			add_location(div2, file$e, 247, 4, 5871);
    			attr_dev(div3, "class", "input-wrap svelte-4m851m");
    			add_location(div3, file$e, 225, 0, 4924);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*value*/ ctx[3]);
    			append_dev(div0, t0);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t2);
    			if (if_block1) if_block1.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "focus", /*focusHandle*/ ctx[7], false, false, false),
    					listen_dev(input, "blur", /*blurHandle*/ ctx[8], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[11])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 8 && input.value !== /*value*/ ctx[3]) {
    				set_input_value(input, /*value*/ ctx[3]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div0, null);
    			}

    			if (!current || dirty & /*condition_result*/ 4 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*condition_result*/ ctx[2]
    			? 'input-container'
    			: 'input-container-not-satisfied') + " svelte-4m851m"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*conditions, value*/ 10) {
    				each_value = /*conditions*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*condition_result*/ ctx[2]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_blocks[current_block_type_index].d();
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function tagSplice(string) {
    	let str = [...string];

    	for (let i = 0; i <= str.length; i++) {
    		if (str[i] == ',') {
    			if (i + 1 == str.length) {
    				str[i] = ' ';
    				str = [...str, '#'];
    			} else {
    				str[i] = ' ';
    				str.splice(i + 1, 0, '#');
    			}
    		}
    	}

    	return str;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputMultiValue', slots, []);
    	const [send, receive] = crossfade({});
    	var dispatch = createEventDispatcher();
    	let { placeholder = null } = $$props;

    	let { conditions = [
    		{
    			condition: () => {
    				
    			},
    			name: "",
    			not_satisfied_text: "",
    			satisfied_text: ""
    		},
    		{
    			condition: () => {
    				
    			},
    			name: "",
    			not_satisfied_text: "",
    			satisfied_text: ""
    		},
    		{
    			condition: () => {
    				
    			},
    			name: "",
    			not_satisfied_text: "",
    			satisfied_text: ""
    		}
    	] } = $$props;

    	let focused = false;
    	let condition_result = false;
    	let value = '';
    	let result = '';
    	let str_list = [];

    	function focusHandle() {
    		$$invalidate(4, focused = true);
    	}

    	function blurHandle() {
    		$$invalidate(4, focused = false);
    	}

    	function conditionResult(value) {
    		let result = true;

    		conditions.forEach(con => {
    			if (!con.condition(value)) {
    				result = false;
    			}
    		});

    		return result;
    	}

    	const writable_props = ['placeholder', 'conditions'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<InputMultiValue> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		((($$invalidate(3, value), $$invalidate(10, str_list)), $$invalidate(9, result)), $$invalidate(2, condition_result));
    	}

    	$$self.$$set = $$props => {
    		if ('placeholder' in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ('conditions' in $$props) $$invalidate(1, conditions = $$props.conditions);
    	};

    	$$self.$capture_state = () => ({
    		Route,
    		router: f,
    		createEventDispatcher,
    		crossfade,
    		flip,
    		send,
    		receive,
    		dispatch,
    		placeholder,
    		conditions,
    		focused,
    		condition_result,
    		value,
    		result,
    		str_list,
    		focusHandle,
    		blurHandle,
    		tagSplice,
    		conditionResult
    	});

    	$$self.$inject_state = $$props => {
    		if ('dispatch' in $$props) $$invalidate(12, dispatch = $$props.dispatch);
    		if ('placeholder' in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ('conditions' in $$props) $$invalidate(1, conditions = $$props.conditions);
    		if ('focused' in $$props) $$invalidate(4, focused = $$props.focused);
    		if ('condition_result' in $$props) $$invalidate(2, condition_result = $$props.condition_result);
    		if ('value' in $$props) $$invalidate(3, value = $$props.value);
    		if ('result' in $$props) $$invalidate(9, result = $$props.result);
    		if ('str_list' in $$props) $$invalidate(10, str_list = $$props.str_list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value, str_list, result, condition_result*/ 1548) {
    			 {
    				$$invalidate(9, result = '');
    				$$invalidate(10, str_list = value.split(''));
    				$$invalidate(10, str_list = tagSplice(str_list));

    				if (str_list) {
    					str_list.forEach(char => {
    						$$invalidate(9, result = result + char);
    					});

    					$$invalidate(3, value = result);
    				}

    				$$invalidate(3, value = value.replace(/\s+[^#]/, '_'));
    				$$invalidate(3, value = value.replace());
    				$$invalidate(2, condition_result = conditionResult(value));
    				console.log(condition_result);
    			}
    		}

    		if ($$self.$$.dirty & /*value*/ 8) {
    			 dispatch('change', { value });
    		}
    	};

    	return [
    		placeholder,
    		conditions,
    		condition_result,
    		value,
    		focused,
    		send,
    		receive,
    		focusHandle,
    		blurHandle,
    		result,
    		str_list,
    		input_input_handler
    	];
    }

    class InputMultiValue extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { placeholder: 0, conditions: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputMultiValue",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get placeholder() {
    		throw new Error("<InputMultiValue>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<InputMultiValue>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get conditions() {
    		throw new Error("<InputMultiValue>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set conditions(value) {
    		throw new Error("<InputMultiValue>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* components/manager/InputCheckboxValue.svelte generated by Svelte v3.50.1 */

    function create_fragment$h(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputCheckboxValue', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputCheckboxValue> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class InputCheckboxValue extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputCheckboxValue",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* components/manager/InputDateValue.svelte generated by Svelte v3.50.1 */

    function create_fragment$i(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputDateValue', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputDateValue> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class InputDateValue extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputDateValue",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* components/manager/InputSelectValue.svelte generated by Svelte v3.50.1 */

    const { console: console_1$3 } = globals;
    const file$f = "components/manager/InputSelectValue.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    // (207:8) {:else}
    function create_else_block$6(ctx) {
    	let div;
    	let h3;
    	let t;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t = text(/*placeholder*/ ctx[0]);
    			attr_dev(h3, "class", "svelte-1xq5eq6");
    			add_location(h3, file$f, 211, 20, 4739);
    			attr_dev(div, "class", "label svelte-1xq5eq6");
    			add_location(div, file$f, 208, 16, 4596);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*placeholder*/ 1) set_data_dev(t, /*placeholder*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, /*receive*/ ctx[6], { key: 'unfocused' });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*send*/ ctx[5], { key: 'focused' });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(207:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (199:8) {#if value}
    function create_if_block_2$3(ctx) {
    	let div;
    	let h3;
    	let t;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t = text(/*placeholder*/ ctx[0]);
    			attr_dev(h3, "class", "svelte-1xq5eq6");
    			add_location(h3, file$f, 203, 20, 4463);
    			attr_dev(div, "class", "label-focused svelte-1xq5eq6");
    			add_location(div, file$f, 200, 16, 4312);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*placeholder*/ 1) set_data_dev(t, /*placeholder*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, /*receive*/ ctx[6], { key: 'focused' });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*send*/ ctx[5], { key: 'unfocused' });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(199:8) {#if value}",
    		ctx
    	});

    	return block;
    }

    // (217:12) {#each option_list as option, index}
    function create_each_block_1(ctx) {
    	let option;
    	let h3;
    	let t_value = /*option*/ ctx[16] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			h3 = element("h3");
    			t = text(t_value);
    			add_location(h3, file$f, 217, 39, 5002);
    			option.__value = option_value_value = /*option*/ ctx[16];
    			option.value = option.__value;
    			add_location(option, file$f, 217, 16, 4979);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, h3);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*option_list*/ 2 && t_value !== (t_value = /*option*/ ctx[16] + "")) set_data_dev(t, t_value);

    			if (dirty & /*option_list*/ 2 && option_value_value !== (option_value_value = /*option*/ ctx[16])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(217:12) {#each option_list as option, index}",
    		ctx
    	});

    	return block;
    }

    // (226:16) {#if !con.condition(value)}
    function create_if_block_1$5(ctx) {
    	let h3;
    	let t_value = /*con*/ ctx[13].not_satisfied_text + "";
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(t_value);
    			attr_dev(h3, "class", "not-satisfied svelte-1xq5eq6");
    			add_location(h3, file$f, 226, 20, 5270);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*conditions*/ 4 && t_value !== (t_value = /*con*/ ctx[13].not_satisfied_text + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(226:16) {#if !con.condition(value)}",
    		ctx
    	});

    	return block;
    }

    // (225:12) {#each conditions as con, con_id}
    function create_each_block$6(ctx) {
    	let show_if = !/*con*/ ctx[13].condition(/*value*/ ctx[3]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_1$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*conditions, value*/ 12) show_if = !/*con*/ ctx[13].condition(/*value*/ ctx[3]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(225:12) {#each conditions as con, con_id}",
    		ctx
    	});

    	return block;
    }

    // (230:12) {#if condition_result}
    function create_if_block$7(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "좋습니다!";
    			attr_dev(h3, "class", "satisfied svelte-1xq5eq6");
    			add_location(h3, file$f, 230, 16, 5423);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(230:12) {#if condition_result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div3;
    	let div0;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let select;
    	let div0_class_value;
    	let t1;
    	let div2;
    	let div1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_2$3, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*value*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let each_value_1 = /*option_list*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*conditions*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	let if_block1 = /*condition_result*/ ctx[4] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(select, "class", "input svelte-1xq5eq6");
    			if (/*value*/ ctx[3] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[9].call(select));
    			add_location(select, file$f, 215, 8, 4826);

    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*condition_result*/ ctx[4]
    			? 'input-container'
    			: 'input-container-not-satisfied') + " svelte-1xq5eq6"));

    			add_location(div0, file$f, 197, 4, 4158);
    			attr_dev(div1, "class", "warning-container svelte-1xq5eq6");
    			add_location(div1, file$f, 223, 8, 5125);
    			attr_dev(div2, "class", "warning-wrap svelte-1xq5eq6");
    			add_location(div2, file$f, 222, 4, 5089);
    			attr_dev(div3, "class", "input-wrap svelte-1xq5eq6");
    			add_location(div3, file$f, 196, 0, 4128);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, select);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select, null);
    			}

    			select_option(select, /*value*/ ctx[3]);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t2);
    			if (if_block1) if_block1.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "focus", /*focusHandle*/ ctx[7], false, false, false),
    					listen_dev(select, "blur", /*blurHandle*/ ctx[8], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div0, t0);
    			}

    			if (dirty & /*option_list*/ 2) {
    				each_value_1 = /*option_list*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*value, option_list*/ 10) {
    				select_option(select, /*value*/ ctx[3]);
    			}

    			if (!current || dirty & /*condition_result*/ 16 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*condition_result*/ ctx[4]
    			? 'input-container'
    			: 'input-container-not-satisfied') + " svelte-1xq5eq6"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*conditions, value*/ 12) {
    				each_value = /*conditions*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*condition_result*/ ctx[4]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$7(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_blocks[current_block_type_index].d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputSelectValue', slots, []);
    	const [send, receive] = crossfade({});
    	var dispatch = createEventDispatcher();
    	let { placeholder = null } = $$props;
    	let { option_list = [] } = $$props;

    	let { conditions = [
    		{
    			condition: () => {
    				
    			},
    			name: "",
    			not_satisfied_text: "",
    			satisfied_text: ""
    		},
    		{
    			condition: () => {
    				
    			},
    			name: "",
    			not_satisfied_text: "",
    			satisfied_text: ""
    		},
    		{
    			condition: () => {
    				
    			},
    			name: "",
    			not_satisfied_text: "",
    			satisfied_text: ""
    		}
    	] } = $$props;

    	let focused = false;
    	let condition_result = false;
    	let value = '';

    	function focusHandle() {
    		focused = true;
    	}

    	function blurHandle() {
    		focused = false;
    	}

    	function conditionResult(value) {
    		let result = true;

    		conditions.forEach(con => {
    			if (!con.condition(value)) {
    				result = false;
    			}
    		});

    		return result;
    	}

    	const writable_props = ['placeholder', 'option_list', 'conditions'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<InputSelectValue> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(3, value);
    		$$invalidate(1, option_list);
    	}

    	$$self.$$set = $$props => {
    		if ('placeholder' in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ('option_list' in $$props) $$invalidate(1, option_list = $$props.option_list);
    		if ('conditions' in $$props) $$invalidate(2, conditions = $$props.conditions);
    	};

    	$$self.$capture_state = () => ({
    		Route,
    		router: f,
    		createEventDispatcher,
    		crossfade,
    		flip,
    		send,
    		receive,
    		dispatch,
    		placeholder,
    		option_list,
    		conditions,
    		focused,
    		condition_result,
    		value,
    		focusHandle,
    		blurHandle,
    		conditionResult
    	});

    	$$self.$inject_state = $$props => {
    		if ('dispatch' in $$props) $$invalidate(11, dispatch = $$props.dispatch);
    		if ('placeholder' in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ('option_list' in $$props) $$invalidate(1, option_list = $$props.option_list);
    		if ('conditions' in $$props) $$invalidate(2, conditions = $$props.conditions);
    		if ('focused' in $$props) focused = $$props.focused;
    		if ('condition_result' in $$props) $$invalidate(4, condition_result = $$props.condition_result);
    		if ('value' in $$props) $$invalidate(3, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 8) {
    			 dispatch('change', { value });
    		}

    		if ($$self.$$.dirty & /*value*/ 8) {
    			 {
    				$$invalidate(4, condition_result = conditionResult(value));
    				console.log(value);
    			}
    		}
    	};

    	return [
    		placeholder,
    		option_list,
    		conditions,
    		value,
    		condition_result,
    		send,
    		receive,
    		focusHandle,
    		blurHandle,
    		select_change_handler
    	];
    }

    class InputSelectValue extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			placeholder: 0,
    			option_list: 1,
    			conditions: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputSelectValue",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get placeholder() {
    		throw new Error("<InputSelectValue>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<InputSelectValue>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get option_list() {
    		throw new Error("<InputSelectValue>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set option_list(value) {
    		throw new Error("<InputSelectValue>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get conditions() {
    		throw new Error("<InputSelectValue>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set conditions(value) {
    		throw new Error("<InputSelectValue>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* components/manager/ManageCreateItem.svelte generated by Svelte v3.50.1 */
    const file$g = "components/manager/ManageCreateItem.svelte";

    // (137:16) {#if checked}
    function create_if_block_2$4(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M4.5 12.75l6 6 9-13.5");
    			add_location(path, file$g, 138, 24, 3055);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "1.5");
    			attr_dev(svg, "stroke", "white");
    			attr_dev(svg, "height", "17");
    			attr_dev(svg, "width", "17");
    			add_location(svg, file$g, 137, 20, 2900);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(137:16) {#if checked}",
    		ctx
    	});

    	return block;
    }

    // (153:12) {:else}
    function create_else_block$7(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(153:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (149:35) 
    function create_if_block_1$6(ctx) {
    	let video;
    	let source;
    	let source_src_value;

    	const block = {
    		c: function create() {
    			video = element("video");
    			source = element("source");
    			if (!src_url_equal(source.src, source_src_value = /*src*/ ctx[1])) attr_dev(source, "src", source_src_value);
    			attr_dev(source, "type", "video/mp4");
    			add_location(source, file$g, 150, 20, 3527);
    			attr_dev(video, "height", "85px");
    			video.controls = true;
    			add_location(video, file$g, 149, 16, 3475);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, video, anchor);
    			append_dev(video, source);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*src*/ 2 && !src_url_equal(source.src, source_src_value = /*src*/ ctx[1])) {
    				attr_dev(source, "src", source_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(video);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(149:35) ",
    		ctx
    	});

    	return block;
    }

    // (147:12) {#if type == '사진'}
    function create_if_block$8(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "85px");
    			attr_dev(img, "alt", "test-img");
    			add_location(img, file$g, 147, 16, 3374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*src*/ 2 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(147:12) {#if type == '사진'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let div10;
    	let div1;
    	let div0;
    	let button0;
    	let button0_class_value;
    	let t0;
    	let div3;
    	let div2;
    	let t1;
    	let div5;
    	let div4;
    	let h3;
    	let t2;
    	let t3;
    	let div7;
    	let div6;
    	let button1;
    	let svg0;
    	let path0;
    	let t4;
    	let div9;
    	let div8;
    	let button2;
    	let svg1;
    	let path1;
    	let mounted;
    	let dispose;
    	let if_block0 = /*checked*/ ctx[0] && create_if_block_2$4(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[2] == '사진') return create_if_block$8;
    		if (/*type*/ ctx[2] == '영상') return create_if_block_1$6;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			if_block1.c();
    			t1 = space();
    			div5 = element("div");
    			div4 = element("div");
    			h3 = element("h3");
    			t2 = text(/*name*/ ctx[3]);
    			t3 = space();
    			div7 = element("div");
    			div6 = element("div");
    			button1 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t4 = space();
    			div9 = element("div");
    			div8 = element("div");
    			button2 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			attr_dev(button0, "class", button0_class_value = "" + (null_to_empty(/*checked*/ ctx[0] ? 'check-btn-clicked' : 'check-btn') + " svelte-ayax6a"));
    			add_location(button0, file$g, 135, 12, 2760);
    			attr_dev(div0, "class", "check-container container svelte-ayax6a");
    			add_location(div0, file$g, 134, 8, 2707);
    			attr_dev(div1, "class", "check-wrap wrap svelte-ayax6a");
    			add_location(div1, file$g, 133, 4, 2668);
    			attr_dev(div2, "class", "snapshot-container container svelte-ayax6a");
    			add_location(div2, file$g, 145, 8, 3282);
    			attr_dev(div3, "class", "snapshot-wrap svelte-ayax6a");
    			add_location(div3, file$g, 144, 4, 3245);
    			attr_dev(h3, "class", "svelte-ayax6a");
    			add_location(h3, file$g, 158, 12, 3750);
    			attr_dev(div4, "class", "title-container container svelte-ayax6a");
    			add_location(div4, file$g, 157, 8, 3697);
    			attr_dev(div5, "class", "title-wrap svelte-ayax6a");
    			add_location(div5, file$g, 156, 4, 3663);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "d", "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3");
    			add_location(path0, file$g, 165, 20, 4098);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-width", "2");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "height", "18");
    			attr_dev(svg0, "width", "18");
    			add_location(svg0, file$g, 164, 16, 3942);
    			attr_dev(button1, "class", "svelte-ayax6a");
    			add_location(button1, file$g, 163, 12, 3892);
    			attr_dev(div6, "class", "download-container container svelte-ayax6a");
    			add_location(div6, file$g, 162, 8, 3836);
    			attr_dev(div7, "class", "download-wrap svelte-ayax6a");
    			add_location(div7, file$g, 161, 4, 3799);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "d", "M6 18L18 6M6 6l12 12");
    			add_location(path1, file$g, 174, 20, 4638);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "1.5");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "height", "18");
    			attr_dev(svg1, "width", "18");
    			add_location(svg1, file$g, 173, 16, 4480);
    			attr_dev(button2, "class", "svelte-ayax6a");
    			add_location(button2, file$g, 172, 12, 4432);
    			attr_dev(div8, "class", "delete-container container svelte-ayax6a");
    			add_location(div8, file$g, 171, 8, 4378);
    			attr_dev(div9, "class", "delete-wrap svelte-ayax6a");
    			add_location(div9, file$g, 170, 4, 4343);
    			attr_dev(div10, "class", "table-content svelte-ayax6a");
    			add_location(div10, file$g, 132, 0, 2635);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div1);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			if (if_block0) if_block0.m(button0, null);
    			append_dev(div10, t0);
    			append_dev(div10, div3);
    			append_dev(div3, div2);
    			if_block1.m(div2, null);
    			append_dev(div10, t1);
    			append_dev(div10, div5);
    			append_dev(div5, div4);
    			append_dev(div4, h3);
    			append_dev(h3, t2);
    			append_dev(div10, t3);
    			append_dev(div10, div7);
    			append_dev(div7, div6);
    			append_dev(div6, button1);
    			append_dev(button1, svg0);
    			append_dev(svg0, path0);
    			append_dev(div10, t4);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, button2);
    			append_dev(button2, svg1);
    			append_dev(svg1, path1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*checkHandle*/ ctx[4], false, false, false),
    					listen_dev(button1, "click", /*downloadCall*/ ctx[5], false, false, false),
    					listen_dev(button2, "click", /*deleteCall*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*checked*/ ctx[0]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2$4(ctx);
    					if_block0.c();
    					if_block0.m(button0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*checked*/ 1 && button0_class_value !== (button0_class_value = "" + (null_to_empty(/*checked*/ ctx[0] ? 'check-btn-clicked' : 'check-btn') + " svelte-ayax6a"))) {
    				attr_dev(button0, "class", button0_class_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			}

    			if (dirty & /*name*/ 8) set_data_dev(t2, /*name*/ ctx[3]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ManageCreateItem', slots, []);
    	let { checked = false } = $$props;
    	let { src = '/public/main_page_bg.JPG' } = $$props;
    	let { index = 0 } = $$props;
    	let { type = '사진' } = $$props;
    	let name = 'unknown';
    	var dispatch = createEventDispatcher();

    	function checkHandle() {
    		if (checked) {
    			$$invalidate(0, checked = false);
    		} else {
    			$$invalidate(0, checked = true);
    		}

    		dispatch('check', { index, checked });
    	}

    	function downloadCall() {
    		dispatch('download', { index });
    	}

    	function deleteCall() {
    		dispatch('delete', { index });
    	}

    	const writable_props = ['checked', 'src', 'index', 'type'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ManageCreateItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('checked' in $$props) $$invalidate(0, checked = $$props.checked);
    		if ('src' in $$props) $$invalidate(1, src = $$props.src);
    		if ('index' in $$props) $$invalidate(7, index = $$props.index);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		checked,
    		src,
    		index,
    		type,
    		name,
    		dispatch,
    		checkHandle,
    		downloadCall,
    		deleteCall
    	});

    	$$self.$inject_state = $$props => {
    		if ('checked' in $$props) $$invalidate(0, checked = $$props.checked);
    		if ('src' in $$props) $$invalidate(1, src = $$props.src);
    		if ('index' in $$props) $$invalidate(7, index = $$props.index);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    		if ('name' in $$props) $$invalidate(3, name = $$props.name);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*src*/ 2) {
    			 {
    				if (src) {
    					let source = src.split('/');
    					$$invalidate(3, name = source.pop());
    				} else {
    					$$invalidate(3, name = "알 수 없는 이름");
    				}
    			}
    		}
    	};

    	return [checked, src, type, name, checkHandle, downloadCall, deleteCall, index];
    }

    class ManageCreateItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { checked: 0, src: 1, index: 7, type: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ManageCreateItem",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get checked() {
    		throw new Error("<ManageCreateItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<ManageCreateItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get src() {
    		throw new Error("<ManageCreateItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<ManageCreateItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<ManageCreateItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<ManageCreateItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<ManageCreateItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<ManageCreateItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* pages/content_container/ManageCreateContainer.svelte generated by Svelte v3.50.1 */

    const { console: console_1$4 } = globals;
    const file$h = "pages/content_container/ManageCreateContainer.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[41] = i;
    	return child_ctx;
    }

    // (579:25) 
    function create_if_block_1$7(ctx) {
    	let div16;
    	let div1;
    	let t0;
    	let div0;
    	let label;
    	let h30;
    	let t2;
    	let input;
    	let t3;
    	let button0;
    	let h31;
    	let t5;
    	let button1;
    	let h32;
    	let t7;
    	let div13;
    	let div2;
    	let button2;
    	let button2_class_value;
    	let t8;
    	let div4;
    	let div3;
    	let h33;
    	let t10;
    	let div6;
    	let div5;
    	let h34;
    	let t12;
    	let div9;
    	let div8;
    	let div7;
    	let svg0;
    	let path0;
    	let t13;
    	let div12;
    	let div11;
    	let div10;
    	let svg1;
    	let path1;
    	let t14;
    	let div15;
    	let div14;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[3] == '사진') return create_if_block_3$1;
    		if (/*type*/ ctx[3] == '영상') return create_if_block_4$1;
    		if (/*type*/ ctx[3] == '문서') return create_if_block_5$1;
    		return create_else_block$8;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*all_checked*/ ctx[4] && create_if_block_2$5(ctx);
    	let each_value = /*item_objs*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div16 = element("div");
    			div1 = element("div");
    			if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			label = element("label");
    			h30 = element("h3");
    			h30.textContent = "업로드";
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			button0 = element("button");
    			h31 = element("h3");
    			h31.textContent = "저장";
    			t5 = space();
    			button1 = element("button");
    			h32 = element("h3");
    			h32.textContent = "삭제";
    			t7 = space();
    			div13 = element("div");
    			div2 = element("div");
    			button2 = element("button");
    			if (if_block1) if_block1.c();
    			t8 = space();
    			div4 = element("div");
    			div3 = element("div");
    			h33 = element("h3");
    			h33.textContent = "스냅샷";
    			t10 = space();
    			div6 = element("div");
    			div5 = element("div");
    			h34 = element("h3");
    			h34.textContent = "파일명";
    			t12 = space();
    			div9 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t13 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t14 = space();
    			div15 = element("div");
    			div14 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h30, "class", "svelte-ubx26m");
    			add_location(h30, file$h, 591, 91, 15863);
    			attr_dev(label, "for", "file-input");
    			attr_dev(label, "class", "file-input-label svelte-ubx26m");
    			add_location(label, file$h, 591, 20, 15792);
    			attr_dev(input, "id", "file-input");
    			attr_dev(input, "name", "file-input");
    			attr_dev(input, "class", "file-input svelte-ubx26m");
    			attr_dev(input, "type", "file");
    			add_location(input, file$h, 592, 24, 15909);
    			attr_dev(h31, "class", "svelte-ubx26m");
    			add_location(h31, file$h, 593, 52, 16064);
    			attr_dev(button0, "class", "svelte-ubx26m");
    			add_location(button0, file$h, 593, 20, 16032);
    			attr_dev(h32, "class", "svelte-ubx26m");
    			add_location(h32, file$h, 594, 50, 16136);
    			attr_dev(button1, "class", "svelte-ubx26m");
    			add_location(button1, file$h, 594, 20, 16106);
    			attr_dev(div0, "class", "control-panel svelte-ubx26m");
    			add_location(div0, file$h, 590, 16, 15743);
    			attr_dev(div1, "class", "header svelte-ubx26m");
    			add_location(div1, file$h, 580, 12, 15390);

    			attr_dev(button2, "class", button2_class_value = "" + (null_to_empty(/*all_checked*/ ctx[4]
    			? 'check-btn-clicked'
    			: 'check-btn') + " svelte-ubx26m"));

    			add_location(button2, file$h, 599, 20, 16319);
    			attr_dev(div2, "class", "header-checkbox-container svelte-ubx26m");
    			add_location(div2, file$h, 598, 16, 16258);
    			attr_dev(h33, "class", "svelte-ubx26m");
    			add_location(h33, file$h, 609, 24, 16988);
    			attr_dev(div3, "class", "header-container svelte-ubx26m");
    			add_location(div3, file$h, 608, 20, 16932);
    			attr_dev(div4, "class", "header-snapshot-container svelte-ubx26m");
    			add_location(div4, file$h, 607, 16, 16871);
    			attr_dev(h34, "class", "svelte-ubx26m");
    			add_location(h34, file$h, 614, 24, 17184);
    			attr_dev(div5, "class", "header-container svelte-ubx26m");
    			add_location(div5, file$h, 613, 20, 17128);
    			attr_dev(div6, "class", "header-title-container svelte-ubx26m");
    			add_location(div6, file$h, 612, 16, 17070);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "d", "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3");
    			add_location(path0, file$h, 621, 32, 17603);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-width", "2");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "height", "18");
    			attr_dev(svg0, "width", "18");
    			add_location(svg0, file$h, 620, 28, 17435);
    			attr_dev(div7, "class", "svg-wrap");
    			add_location(div7, file$h, 619, 24, 17383);
    			attr_dev(div8, "class", "header-container svelte-ubx26m");
    			add_location(div8, file$h, 618, 20, 17327);
    			attr_dev(div9, "class", "header-download-container svelte-ubx26m");
    			add_location(div9, file$h, 617, 16, 17266);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "d", "M6 18L18 6M6 6l12 12");
    			add_location(path1, file$h, 630, 32, 18240);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "2");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "height", "18");
    			attr_dev(svg1, "width", "18");
    			add_location(svg1, file$h, 629, 28, 18072);
    			attr_dev(div10, "class", "svg-wrap");
    			add_location(div10, file$h, 628, 24, 18020);
    			attr_dev(div11, "class", "header-container svelte-ubx26m");
    			add_location(div11, file$h, 627, 20, 17964);
    			attr_dev(div12, "class", "header-delete-container svelte-ubx26m");
    			add_location(div12, file$h, 626, 16, 17905);
    			attr_dev(div13, "class", "table-header svelte-ubx26m");
    			add_location(div13, file$h, 597, 12, 16214);
    			attr_dev(div14, "class", "table svelte-ubx26m");
    			add_location(div14, file$h, 637, 16, 18510);
    			attr_dev(div15, "class", "body svelte-ubx26m");
    			add_location(div15, file$h, 636, 12, 18474);
    			attr_dev(div16, "class", "upload-view svelte-ubx26m");
    			add_location(div16, file$h, 579, 8, 15351);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div1);
    			if_block0.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, label);
    			append_dev(label, h30);
    			append_dev(div0, t2);
    			append_dev(div0, input);
    			append_dev(div0, t3);
    			append_dev(div0, button0);
    			append_dev(button0, h31);
    			append_dev(div0, t5);
    			append_dev(div0, button1);
    			append_dev(button1, h32);
    			append_dev(div16, t7);
    			append_dev(div16, div13);
    			append_dev(div13, div2);
    			append_dev(div2, button2);
    			if (if_block1) if_block1.m(button2, null);
    			append_dev(div13, t8);
    			append_dev(div13, div4);
    			append_dev(div4, div3);
    			append_dev(div3, h33);
    			append_dev(div13, t10);
    			append_dev(div13, div6);
    			append_dev(div6, div5);
    			append_dev(div5, h34);
    			append_dev(div13, t12);
    			append_dev(div13, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, svg0);
    			append_dev(svg0, path0);
    			append_dev(div13, t13);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, svg1);
    			append_dev(svg1, path1);
    			append_dev(div16, t14);
    			append_dev(div16, div15);
    			append_dev(div15, div14);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div14, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(label, "click", /*uploadCall*/ ctx[23], false, false, false),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[24]),
    					listen_dev(button0, "click", /*downloadCall*/ ctx[21], false, false, false),
    					listen_dev(button1, "click", /*deleteCall*/ ctx[22], false, false, false),
    					listen_dev(button2, "click", /*allCheckHandle*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, t0);
    				}
    			}

    			if (/*all_checked*/ ctx[4]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_2$5(ctx);
    					if_block1.c();
    					if_block1.m(button2, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty[0] & /*all_checked*/ 16 && button2_class_value !== (button2_class_value = "" + (null_to_empty(/*all_checked*/ ctx[4]
    			? 'check-btn-clicked'
    			: 'check-btn') + " svelte-ubx26m"))) {
    				attr_dev(button2, "class", button2_class_value);
    			}

    			if (dirty[0] & /*item_objs, type, deleteHandle, downloadHandle, checkHandle*/ 1835018) {
    				each_value = /*item_objs*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div14, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div16);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(579:25) ",
    		ctx
    	});

    	return block;
    }

    // (549:4) {#if stage == 1}
    function create_if_block$9(ctx) {
    	let div1;
    	let div0;
    	let h30;
    	let t1;
    	let inputsinglevalue0;
    	let t2;
    	let inputmultivalue;
    	let t3;
    	let div3;
    	let div2;
    	let t4;
    	let inputsinglevalue1;
    	let t5;
    	let inputselectvalue0;
    	let t6;
    	let div5;
    	let div4;
    	let t7;
    	let inputselectvalue1;
    	let t8;
    	let inputsinglevalue2;
    	let t9;
    	let div6;
    	let t10;
    	let div8;
    	let div7;
    	let h31;
    	let t12;
    	let inputsinglevalue3;
    	let t13;
    	let inputsinglevalue4;
    	let current;

    	inputsinglevalue0 = new InputSingleValue({
    			props: {
    				placeholder: "제목을 입력해주세요",
    				conditions: /*default_conditions*/ ctx[6],
    				value: /*title*/ ctx[2]
    			},
    			$$inline: true
    		});

    	inputsinglevalue0.$on("change", /*titleChange*/ ctx[8]);
    	inputsinglevalue0.$on("pass", /*passHandle*/ ctx[16]);

    	inputmultivalue = new InputMultiValue({
    			props: {
    				placeholder: "주요 참석자들을 입력해주세요",
    				conditions: /*attendee_conditions*/ ctx[7]
    			},
    			$$inline: true
    		});

    	inputmultivalue.$on("change", /*attendeeChange*/ ctx[12]);
    	inputmultivalue.$on("pass", /*passHandle*/ ctx[16]);

    	inputsinglevalue1 = new InputSingleValue({
    			props: {
    				placeholder: "행사 장소를 입력해주세요",
    				conditions: /*default_conditions*/ ctx[6]
    			},
    			$$inline: true
    		});

    	inputsinglevalue1.$on("change", /*locationChange*/ ctx[9]);
    	inputsinglevalue1.$on("pass", /*passHandle*/ ctx[16]);

    	inputselectvalue0 = new InputSelectValue({
    			props: {
    				placeholder: "기록 유형을 선택해주세요",
    				conditions: /*attendee_conditions*/ ctx[7],
    				option_list: ['영상', '사진', '문서']
    			},
    			$$inline: true
    		});

    	inputselectvalue0.$on("change", /*typeChange*/ ctx[14]);
    	inputselectvalue0.$on("pass", /*passHandle*/ ctx[16]);

    	inputselectvalue1 = new InputSelectValue({
    			props: {
    				placeholder: "생산물 여부를 선택해주세요",
    				conditions: /*attendee_conditions*/ ctx[7],
    				option_list: ['생산', '수집']
    			},
    			$$inline: true
    		});

    	inputselectvalue1.$on("change", /*producedChange*/ ctx[13]);
    	inputselectvalue1.$on("pass", /*passHandle*/ ctx[16]);

    	inputsinglevalue2 = new InputSingleValue({
    			props: {
    				placeholder: "생산 부대를 입력해주세요",
    				conditions: /*default_conditions*/ ctx[6]
    			},
    			$$inline: true
    		});

    	inputsinglevalue2.$on("change", /*affiliationChange*/ ctx[10]);
    	inputsinglevalue2.$on("pass", /*passHandle*/ ctx[16]);

    	inputsinglevalue3 = new InputSingleValue({
    			props: {
    				placeholder: "촬영자를 입력해주세요",
    				conditions: /*default_conditions*/ ctx[6]
    			},
    			$$inline: true
    		});

    	inputsinglevalue3.$on("change", /*associateChange*/ ctx[11]);
    	inputsinglevalue3.$on("pass", /*passHandle*/ ctx[16]);

    	inputsinglevalue4 = new InputSingleValue({
    			props: {
    				placeholder: "생산연도를 입력해주세요",
    				conditions: /*default_conditions*/ ctx[6]
    			},
    			$$inline: true
    		});

    	inputsinglevalue4.$on("change", /*dateChange*/ ctx[15]);
    	inputsinglevalue4.$on("pass", /*passHandle*/ ctx[16]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			h30.textContent = "기본 등록 정보";
    			t1 = space();
    			create_component(inputsinglevalue0.$$.fragment);
    			t2 = space();
    			create_component(inputmultivalue.$$.fragment);
    			t3 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t4 = space();
    			create_component(inputsinglevalue1.$$.fragment);
    			t5 = space();
    			create_component(inputselectvalue0.$$.fragment);
    			t6 = space();
    			div5 = element("div");
    			div4 = element("div");
    			t7 = space();
    			create_component(inputselectvalue1.$$.fragment);
    			t8 = space();
    			create_component(inputsinglevalue2.$$.fragment);
    			t9 = space();
    			div6 = element("div");
    			t10 = space();
    			div8 = element("div");
    			div7 = element("div");
    			h31 = element("h3");
    			h31.textContent = "생산 정보";
    			t12 = space();
    			create_component(inputsinglevalue3.$$.fragment);
    			t13 = space();
    			create_component(inputsinglevalue4.$$.fragment);
    			attr_dev(h30, "class", "svelte-ubx26m");
    			add_location(h30, file$h, 551, 16, 13661);
    			attr_dev(div0, "class", "input-category-title svelte-ubx26m");
    			add_location(div0, file$h, 550, 12, 13609);
    			attr_dev(div1, "class", "single-input-wrap svelte-ubx26m");
    			add_location(div1, file$h, 549, 8, 13564);
    			attr_dev(div2, "class", "padding svelte-ubx26m");
    			add_location(div2, file$h, 557, 12, 14064);
    			attr_dev(div3, "class", "single-input-wrap svelte-ubx26m");
    			add_location(div3, file$h, 556, 8, 14019);
    			attr_dev(div4, "class", "padding svelte-ubx26m");
    			add_location(div4, file$h, 562, 12, 14476);
    			attr_dev(div5, "class", "single-input-wrap svelte-ubx26m");
    			add_location(div5, file$h, 561, 8, 14431);
    			attr_dev(div6, "class", "buffer svelte-ubx26m");
    			add_location(div6, file$h, 567, 8, 14847);
    			attr_dev(h31, "class", "svelte-ubx26m");
    			add_location(h31, file$h, 572, 16, 14984);
    			attr_dev(div7, "class", "input-category-title svelte-ubx26m");
    			add_location(div7, file$h, 571, 12, 14932);
    			attr_dev(div8, "class", "single-input-wrap svelte-ubx26m");
    			add_location(div8, file$h, 570, 8, 14887);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h30);
    			append_dev(div1, t1);
    			mount_component(inputsinglevalue0, div1, null);
    			append_dev(div1, t2);
    			mount_component(inputmultivalue, div1, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div3, t4);
    			mount_component(inputsinglevalue1, div3, null);
    			append_dev(div3, t5);
    			mount_component(inputselectvalue0, div3, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div5, t7);
    			mount_component(inputselectvalue1, div5, null);
    			append_dev(div5, t8);
    			mount_component(inputsinglevalue2, div5, null);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div6, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div7);
    			append_dev(div7, h31);
    			append_dev(div8, t12);
    			mount_component(inputsinglevalue3, div8, null);
    			append_dev(div8, t13);
    			mount_component(inputsinglevalue4, div8, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputsinglevalue0_changes = {};
    			if (dirty[0] & /*title*/ 4) inputsinglevalue0_changes.value = /*title*/ ctx[2];
    			inputsinglevalue0.$set(inputsinglevalue0_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputsinglevalue0.$$.fragment, local);
    			transition_in(inputmultivalue.$$.fragment, local);
    			transition_in(inputsinglevalue1.$$.fragment, local);
    			transition_in(inputselectvalue0.$$.fragment, local);
    			transition_in(inputselectvalue1.$$.fragment, local);
    			transition_in(inputsinglevalue2.$$.fragment, local);
    			transition_in(inputsinglevalue3.$$.fragment, local);
    			transition_in(inputsinglevalue4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputsinglevalue0.$$.fragment, local);
    			transition_out(inputmultivalue.$$.fragment, local);
    			transition_out(inputsinglevalue1.$$.fragment, local);
    			transition_out(inputselectvalue0.$$.fragment, local);
    			transition_out(inputselectvalue1.$$.fragment, local);
    			transition_out(inputsinglevalue2.$$.fragment, local);
    			transition_out(inputsinglevalue3.$$.fragment, local);
    			transition_out(inputsinglevalue4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(inputsinglevalue0);
    			destroy_component(inputmultivalue);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div3);
    			destroy_component(inputsinglevalue1);
    			destroy_component(inputselectvalue0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div5);
    			destroy_component(inputselectvalue1);
    			destroy_component(inputsinglevalue2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div6);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div8);
    			destroy_component(inputsinglevalue3);
    			destroy_component(inputsinglevalue4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(549:4) {#if stage == 1}",
    		ctx
    	});

    	return block;
    }

    // (588:16) {:else}
    function create_else_block$8(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "다시 시도해 주세요";
    			attr_dev(h3, "class", "svelte-ubx26m");
    			add_location(h3, file$h, 588, 20, 15683);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(588:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (586:39) 
    function create_if_block_5$1(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "문서 업로드";
    			attr_dev(h3, "class", "svelte-ubx26m");
    			add_location(h3, file$h, 586, 20, 15621);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(586:39) ",
    		ctx
    	});

    	return block;
    }

    // (584:39) 
    function create_if_block_4$1(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "영상 업로드";
    			attr_dev(h3, "class", "svelte-ubx26m");
    			add_location(h3, file$h, 584, 20, 15543);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(584:39) ",
    		ctx
    	});

    	return block;
    }

    // (582:16) {#if type == '사진'}
    function create_if_block_3$1(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "사진 업로드";
    			attr_dev(h3, "class", "svelte-ubx26m");
    			add_location(h3, file$h, 582, 17, 15465);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(582:16) {#if type == '사진'}",
    		ctx
    	});

    	return block;
    }

    // (601:24) {#if all_checked}
    function create_if_block_2$5(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M4.5 12.75l6 6 9-13.5");
    			add_location(path, file$h, 602, 32, 16649);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "1.5");
    			attr_dev(svg, "stroke", "white");
    			attr_dev(svg, "height", "17");
    			attr_dev(svg, "width", "17");
    			add_location(svg, file$h, 601, 28, 16486);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(601:24) {#if all_checked}",
    		ctx
    	});

    	return block;
    }

    // (639:20) {#each item_objs as item, index}
    function create_each_block$7(ctx) {
    	let managecreateitem;
    	let current;

    	managecreateitem = new ManageCreateItem({
    			props: {
    				checked: /*item*/ ctx[39].checked,
    				src: /*item*/ ctx[39].src,
    				index: /*index*/ ctx[41],
    				type: /*type*/ ctx[3]
    			},
    			$$inline: true
    		});

    	managecreateitem.$on("delete", /*deleteHandle*/ ctx[19]);
    	managecreateitem.$on("download", /*downloadHandle*/ ctx[18]);
    	managecreateitem.$on("check", /*checkHandle*/ ctx[20]);

    	const block = {
    		c: function create() {
    			create_component(managecreateitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(managecreateitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const managecreateitem_changes = {};
    			if (dirty[0] & /*item_objs*/ 2) managecreateitem_changes.checked = /*item*/ ctx[39].checked;
    			if (dirty[0] & /*item_objs*/ 2) managecreateitem_changes.src = /*item*/ ctx[39].src;
    			if (dirty[0] & /*type*/ 8) managecreateitem_changes.type = /*type*/ ctx[3];
    			managecreateitem.$set(managecreateitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(managecreateitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(managecreateitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(managecreateitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(639:20) {#each item_objs as item, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$9, create_if_block_1$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*stage*/ ctx[0] == 1) return 0;
    		if (/*stage*/ ctx[0] == 2) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "browse-content-container svelte-ubx26m");
    			add_location(div, file$h, 547, 0, 13494);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function downloader(item) {
    	if (!item) {
    		console.log('cannot find item');
    	}

    	console.log("downloading from...", item.src);
    }

    function categoryChange(e) {
    	category = e.detail.value;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ManageCreateContainer', slots, []);
    	let { stage = 1 } = $$props;
    	let title;
    	let location;
    	let affiliation;
    	let associate;
    	let attendee;
    	let date;
    	let produced = true;
    	let type = '문서';
    	let source;
    	let pass_list = {};

    	// FILE_UPLOADING is a flag for which to track if file is being 
    	// transfered in that moment of time
    	let file_uploading = false;

    	let all_checked = false;
    	let received_file = false;

    	let item_objs = [
    		{
    			checked: false,
    			src: "/public/main_page_bg.JPG"
    		},
    		{
    			checked: false,
    			src: "/public/main_page_bg.JPG"
    		},
    		{
    			checked: false,
    			src: "/public/main_page_bg.JPG"
    		},
    		{
    			checked: false,
    			src: "/public/main_page_bg.JPG"
    		},
    		{
    			checked: false,
    			src: "/public/main_page_bg.JPG"
    		},
    		{
    			checked: false,
    			src: "/public/main_page_bg.JPG"
    		},
    		{
    			checked: false,
    			src: "/public/main_page_bg.JPG"
    		}
    	];

    	let default_conditions = [
    		{
    			condition: val => {
    				if (val.length >= 1) {
    					return true;
    				}

    				return false;
    			},
    			name: "longerThanOneLetter",
    			not_satisfied_text: "최소 한자 이상 들어가야 합니다"
    		},
    		{
    			condition: val => {
    				if (val.length <= 20) {
    					return true;
    				}

    				return false;
    			},
    			name: "shorterThanGivenLength",
    			not_satisfied_text: "더 짧게 입력해주세요"
    		}
    	];

    	let attendee_conditions = [
    		{
    			condition: val => {
    				let words = val.split(' ');

    				if (words.length >= 1 && words[0] != '' && words[0] != '#') {
    					return true;
    				}

    				return false;
    			},
    			name: "longerThanOneWord",
    			not_satisfied_text: "인물이 한명 이상 들어가야 합니다",
    			satisfied_text: "좋습니다!"
    		}
    	];

    	function titleChange(e) {
    		$$invalidate(2, title = e.detail.value);
    	}

    	function locationChange(e) {
    		location = e.detail.value;
    	}

    	function affiliationChange(e) {
    		affiliation = e.detail.value;
    	}

    	function associateChange(e) {
    		associate = e.detail.value;
    	}

    	function attendeeChange(e) {
    		attendee = e.detail.value;
    	}

    	function producedChange(e) {
    		produced = e.detail.value;
    	}

    	function typeChange(e) {
    		$$invalidate(3, type = e.detail.value);
    	}

    	function dateChange(e) {
    		date = e.detail.value;
    	}

    	function sourceChange(e) {
    		source = e.detail.value;
    	}

    	// Handler is received from components
    	function passHandle(e) {
    		let input_name = e.detail.name;
    		pass_list[input_name] = e.detail.pass;
    	}

    	function allCheckHandle(e) {
    		if (all_checked) {
    			$$invalidate(4, all_checked = false);

    			item_objs.forEach(item => {
    				item.checked = false;
    			});
    		} else {
    			$$invalidate(4, all_checked = true);

    			item_objs.forEach(item => {
    				item.checked = true;
    			});
    		}

    		($$invalidate(1, item_objs), $$invalidate(0, stage));
    	}

    	function downloadHandle(e) {
    		let index = e.detail.index;
    		downloader(item_objs[index]);
    	}

    	function deleteHandle(e) {
    		let index = e.detail.index;

    		if (item_objs[index]) {
    			let pop_obj = item_objs.splice(index, 1);
    			console.log(pop_obj[0].src);
    			console.log(item_objs);

    			if (pop_obj[0].src) {
    				console.log('revoking Url');
    				URL.revokeObjectURL(pop_obj[0].src);
    			} else {
    				console.log('Url revoking error');
    			}

    			($$invalidate(1, item_objs), $$invalidate(0, stage));
    		} else {
    			console.log(`item_objs[${index}] doesn't exist`);
    		}
    	}

    	function checkHandle(e) {
    		let index = e.detail.index;
    		let checked = e.detail.checked;

    		if (item_objs[index]) {
    			$$invalidate(1, item_objs[index].checked = checked, item_objs);
    		} else {
    			console.log(`item_objs[${index}] doesn't exist`);
    		}

    		($$invalidate(1, item_objs), $$invalidate(0, stage));
    	}

    	// Call is received directly from buttons
    	function downloadCall() {
    		item_objs.forEach(item => {
    			if (item.checked) {
    				downloader(item);
    				item.checked = false;
    			}
    		});

    		($$invalidate(1, item_objs), $$invalidate(0, stage));
    	}

    	function deleteCall() {
    		let result = getItemList();
    		console.log(result.length);

    		for (let i = 0; i < result.length; i++) {
    			console.log(i);

    			if (result[i].checked) {
    				let pop_obj = result.splice(i, 1);

    				if (pop_obj[0].src) {
    					console.log('revoking Url');
    					URL.revokeObjectURL(pop_obj[0].src);
    				} else {
    					console.log('Url revoking error');
    				}

    				i = i - 1;
    			}
    		}

    		$$invalidate(1, item_objs = result);
    	}

    	function uploadCall() {
    		console.log('uploading call received');
    		waitFile();
    	}

    	function waitFile(index) {
    		if (!received_file) {
    			setTimeout(() => waitFile(), 1000);
    		} else {
    			console.log('waitfile fired');
    			let src = URL.createObjectURL(received_file[0]);
    			let file = received_file[0];
    			console.log('received the file:', received_file, src);
    			let new_item = { checked: false, src, file };
    			$$invalidate(1, item_objs = [...item_objs, new_item]);
    			$$invalidate(5, received_file = false);
    		}
    	}

    	// Utility functions
    	function getItemListLength() {
    		return getItemList().length;
    	}

    	function getItemList() {
    		// returns copied list of ITEM_OBJS
    		return [...item_objs];
    	}

    	async function fileUpload() {
    		if (item_objs && !file_uploading) {
    			let files = [];

    			item_objs.forEach(item => {
    				files = [...files, item.file];
    			});

    			file_uploading = true;

    			try {
    				let result = await axios$1.post('http://localhost:4000/post/file', { files });
    			} catch(error) {
    				console.log(error);
    			}

    			file_uploading = false;
    			console.log('file_uploading procedure ended');
    		}
    	}

    	const writable_props = ['stage'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<ManageCreateContainer> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		received_file = this.files;
    		$$invalidate(5, received_file);
    	}

    	$$self.$$set = $$props => {
    		if ('stage' in $$props) $$invalidate(0, stage = $$props.stage);
    	};

    	$$self.$capture_state = () => ({
    		Route,
    		router: f,
    		axios: axios$1,
    		createEventDispatcher,
    		crossfade,
    		flip,
    		InputSingleValue,
    		InputMultiValue,
    		InputCheckboxValue,
    		InputDateValue,
    		InputSelectValue,
    		ManageCreateItem,
    		stage,
    		title,
    		location,
    		affiliation,
    		associate,
    		attendee,
    		date,
    		produced,
    		type,
    		source,
    		pass_list,
    		file_uploading,
    		all_checked,
    		received_file,
    		item_objs,
    		default_conditions,
    		attendee_conditions,
    		downloader,
    		titleChange,
    		locationChange,
    		affiliationChange,
    		associateChange,
    		attendeeChange,
    		producedChange,
    		typeChange,
    		dateChange,
    		categoryChange,
    		sourceChange,
    		passHandle,
    		allCheckHandle,
    		downloadHandle,
    		deleteHandle,
    		checkHandle,
    		downloadCall,
    		deleteCall,
    		uploadCall,
    		waitFile,
    		getItemListLength,
    		getItemList,
    		fileUpload
    	});

    	$$self.$inject_state = $$props => {
    		if ('stage' in $$props) $$invalidate(0, stage = $$props.stage);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('location' in $$props) location = $$props.location;
    		if ('affiliation' in $$props) affiliation = $$props.affiliation;
    		if ('associate' in $$props) associate = $$props.associate;
    		if ('attendee' in $$props) attendee = $$props.attendee;
    		if ('date' in $$props) date = $$props.date;
    		if ('produced' in $$props) produced = $$props.produced;
    		if ('type' in $$props) $$invalidate(3, type = $$props.type);
    		if ('source' in $$props) source = $$props.source;
    		if ('pass_list' in $$props) pass_list = $$props.pass_list;
    		if ('file_uploading' in $$props) file_uploading = $$props.file_uploading;
    		if ('all_checked' in $$props) $$invalidate(4, all_checked = $$props.all_checked);
    		if ('received_file' in $$props) $$invalidate(5, received_file = $$props.received_file);
    		if ('item_objs' in $$props) $$invalidate(1, item_objs = $$props.item_objs);
    		if ('default_conditions' in $$props) $$invalidate(6, default_conditions = $$props.default_conditions);
    		if ('attendee_conditions' in $$props) $$invalidate(7, attendee_conditions = $$props.attendee_conditions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*stage, item_objs*/ 3) {
    			 {
    				if (stage == 1) {
    					if (item_objs) {
    						item_objs.forEach(item => {
    							URL.revokeObjectURL(item.src);
    						});

    						$$invalidate(1, item_objs = []);
    					}
    				} else if (stage == 3) {
    					let result = fileUpload();
    					console.log(result);
    				}
    			}
    		}
    	};

    	return [
    		stage,
    		item_objs,
    		title,
    		type,
    		all_checked,
    		received_file,
    		default_conditions,
    		attendee_conditions,
    		titleChange,
    		locationChange,
    		affiliationChange,
    		associateChange,
    		attendeeChange,
    		producedChange,
    		typeChange,
    		dateChange,
    		passHandle,
    		allCheckHandle,
    		downloadHandle,
    		deleteHandle,
    		checkHandle,
    		downloadCall,
    		deleteCall,
    		uploadCall,
    		input_change_handler
    	];
    }

    class ManageCreateContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { stage: 0 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ManageCreateContainer",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get stage() {
    		throw new Error("<ManageCreateContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stage(value) {
    		throw new Error("<ManageCreateContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* pages/sidebar/ManageCreateNavbar.svelte generated by Svelte v3.50.1 */
    const file$i = "pages/sidebar/ManageCreateNavbar.svelte";

    // (138:8) {#if stage != 1}
    function create_if_block$a(ctx) {
    	let div;
    	let button;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M15.75 19.5L8.25 12l7.5-7.5");
    			add_location(path, file$i, 141, 24, 3230);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2.5");
    			attr_dev(svg, "stroke", "white");
    			attr_dev(svg, "class", "left-svg svelte-1crfji7");
    			attr_dev(svg, "width", "19");
    			attr_dev(svg, "height", "19");
    			add_location(svg, file$i, 140, 20, 3058);
    			attr_dev(button, "class", "go-back svelte-1crfji7");
    			add_location(button, file$i, 139, 16, 2987);
    			attr_dev(div, "class", "go-back-wrap svelte-1crfji7");
    			add_location(div, file$i, 138, 12, 2943);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*stageDecrease*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(138:8) {#if stage != 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div1;
    	let t;
    	let div0;
    	let button;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;
    	let if_block = /*stage*/ ctx[0] != 1 && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M8.25 4.5l7.5 7.5-7.5 7.5");
    			add_location(path, file$i, 151, 20, 3699);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2.5");
    			attr_dev(svg, "stroke", "white");
    			attr_dev(svg, "class", "right-svg svelte-1crfji7");
    			attr_dev(svg, "width", "19");
    			attr_dev(svg, "height", "19");
    			add_location(svg, file$i, 150, 16, 3530);
    			attr_dev(button, "class", "go-forth svelte-1crfji7");
    			add_location(button, file$i, 149, 12, 3462);
    			attr_dev(div0, "class", "go-forth-wrap svelte-1crfji7");
    			add_location(div0, file$i, 148, 8, 3421);
    			attr_dev(div1, "class", "browse-navbar-wrap svelte-1crfji7");
    			add_location(div1, file$i, 135, 0, 2869);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*stageIncrease*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*stage*/ ctx[0] != 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ManageCreateNavbar', slots, []);
    	var dispatch = createEventDispatcher();
    	let { stage = 1 } = $$props;

    	function stageIncrease() {
    		$$invalidate(0, stage += 1);
    		dispatch('stageChange', { stage });
    	}

    	function stageDecrease() {
    		if (stage != 1) {
    			$$invalidate(0, stage -= 1);
    			dispatch('stageChange', { stage });
    		}
    	}

    	const writable_props = ['stage'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ManageCreateNavbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('stage' in $$props) $$invalidate(0, stage = $$props.stage);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		stage,
    		stageIncrease,
    		stageDecrease
    	});

    	$$self.$inject_state = $$props => {
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('stage' in $$props) $$invalidate(0, stage = $$props.stage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [stage, stageIncrease, stageDecrease];
    }

    class ManageCreateNavbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { stage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ManageCreateNavbar",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get stage() {
    		throw new Error("<ManageCreateNavbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stage(value) {
    		throw new Error("<ManageCreateNavbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* pages/sidebar/ManageCategory.svelte generated by Svelte v3.50.1 */
    const file$j = "pages/sidebar/ManageCategory.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (100:4) {:else}
    function create_else_block$9(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M19.5 8.25l-7.5 7.5-7.5-7.5");
    			add_location(path, file$j, 101, 8, 2551);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "3");
    			attr_dev(svg, "stroke", "white");
    			attr_dev(svg, "class", "w-6 h-6 svelte-1ko1bmi");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			add_location(svg, file$j, 100, 4, 2398);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(100:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (96:4) {#if selected_index == index}
    function create_if_block_1$8(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M4.5 15.75l7.5-7.5 7.5 7.5");
    			add_location(path, file$j, 97, 12, 2277);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "3");
    			attr_dev(svg, "stroke", "white");
    			attr_dev(svg, "class", "w-6 h-6 svelte-1ko1bmi");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			add_location(svg, file$j, 96, 8, 2120);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(96:4) {#if selected_index == index}",
    		ctx
    	});

    	return block;
    }

    // (106:0) {#if selected_index == index}
    function create_if_block$b(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;
    	let each_value = /*sub_categories*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "sub-category-container svelte-1ko1bmi");
    			add_location(div, file$j, 106, 4, 2706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*categoryNavigate, sub_categories*/ 24) {
    				each_value = /*sub_categories*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, slide, { duration: 400, easing: quintOut });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, slide, { duration: 10, easing: quadIn });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(106:0) {#if selected_index == index}",
    		ctx
    	});

    	return block;
    }

    // (108:8) {#each sub_categories as sub_category, sub_index}
    function create_each_block$8(ctx) {
    	let div;
    	let h3;
    	let t0_value = /*sub_category*/ ctx[8].name + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*sub_index*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(h3, "class", "svelte-1ko1bmi");
    			add_location(h3, file$j, 109, 16, 2990);
    			attr_dev(div, "class", "sub-category svelte-1ko1bmi");
    			add_location(div, file$j, 108, 12, 2901);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(108:8) {#each sub_categories as sub_category, sub_index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let div;
    	let h3;
    	let t0_value = /*category*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*selected_index*/ ctx[1] == /*index*/ ctx[2]) return create_if_block_1$8;
    		return create_else_block$9;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*selected_index*/ ctx[1] == /*index*/ ctx[2] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(h3, "class", "svelte-1ko1bmi");
    			add_location(h3, file$j, 94, 4, 2051);
    			attr_dev(div, "class", "category svelte-1ko1bmi");
    			add_location(div, file$j, 93, 0, 1997);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    			if_block0.m(div, null);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*categorySelect*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*category*/ 1) && t0_value !== (t0_value = /*category*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, null);
    				}
    			}

    			if (/*selected_index*/ ctx[1] == /*index*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*selected_index, index*/ 6) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$b(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ManageCategory', slots, []);
    	let { category = { name: '이름없음', sub_category: [] } } = $$props;
    	let { selected_index = null } = $$props;
    	let { index = 0 } = $$props;
    	let sub_categories = category.sub_category;
    	var dispatch = createEventDispatcher();

    	function categoryNavigate(sub_index) {
    		dispatch('navigate', { path: sub_categories[sub_index].path });
    	}

    	function categorySelect() {
    		if (index == selected_index) {
    			dispatch('click', { index: null });
    		} else {
    			dispatch('click', { index });
    		}
    	}

    	const writable_props = ['category', 'selected_index', 'index'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ManageCategory> was created with unknown prop '${key}'`);
    	});

    	const click_handler = sub_index => categoryNavigate(sub_index);

    	$$self.$$set = $$props => {
    		if ('category' in $$props) $$invalidate(0, category = $$props.category);
    		if ('selected_index' in $$props) $$invalidate(1, selected_index = $$props.selected_index);
    		if ('index' in $$props) $$invalidate(2, index = $$props.index);
    	};

    	$$self.$capture_state = () => ({
    		category,
    		selected_index,
    		index,
    		sub_categories,
    		createEventDispatcher,
    		fly,
    		slide,
    		quintIn,
    		quintOut,
    		quadIn,
    		dispatch,
    		categoryNavigate,
    		categorySelect
    	});

    	$$self.$inject_state = $$props => {
    		if ('category' in $$props) $$invalidate(0, category = $$props.category);
    		if ('selected_index' in $$props) $$invalidate(1, selected_index = $$props.selected_index);
    		if ('index' in $$props) $$invalidate(2, index = $$props.index);
    		if ('sub_categories' in $$props) $$invalidate(3, sub_categories = $$props.sub_categories);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		category,
    		selected_index,
    		index,
    		sub_categories,
    		categoryNavigate,
    		categorySelect,
    		click_handler
    	];
    }

    class ManageCategory extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { category: 0, selected_index: 1, index: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ManageCategory",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get category() {
    		throw new Error("<ManageCategory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<ManageCategory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected_index() {
    		throw new Error("<ManageCategory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected_index(value) {
    		throw new Error("<ManageCategory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<ManageCategory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<ManageCategory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* components/manager/ManageSidebar.svelte generated by Svelte v3.50.1 */
    const file$k = "components/manager/ManageSidebar.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (71:4) {:else}
    function create_else_block$a(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "비어있음";
    			add_location(h3, file$k, 71, 8, 1719);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$a.name,
    		type: "else",
    		source: "(71:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (69:4) {#each categories as category, index}
    function create_each_block$9(ctx) {
    	let managecategory;
    	let current;

    	managecategory = new ManageCategory({
    			props: {
    				category: /*category*/ ctx[4],
    				index: /*index*/ ctx[6],
    				selected_index: /*selected_index*/ ctx[0]
    			},
    			$$inline: true
    		});

    	managecategory.$on("click", /*categorySelect*/ ctx[2]);
    	managecategory.$on("navigate", /*categoryNavigate*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(managecategory.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(managecategory, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const managecategory_changes = {};
    			if (dirty & /*selected_index*/ 1) managecategory_changes.selected_index = /*selected_index*/ ctx[0];
    			managecategory.$set(managecategory_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(managecategory.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(managecategory.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(managecategory, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(69:4) {#each categories as category, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let current;
    	let each_value = /*categories*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$a(ctx);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			attr_dev(div0, "class", "block svelte-r7n4zx");
    			add_location(div0, file$k, 66, 4, 1472);
    			attr_dev(div1, "class", "browse-control-container svelte-r7n4zx");
    			add_location(div1, file$k, 65, 0, 1428);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*categories, selected_index, categorySelect, categoryNavigate*/ 15) {
    				each_value = /*categories*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block$a(ctx);
    					each_1_else.c();
    					each_1_else.m(div1, null);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ManageSidebar', slots, []);

    	let categories = [
    		{
    			name: '기록물 관리',
    			sub_category: [
    				{
    					name: '기록물 관리',
    					path: '/manage/cases/browse'
    				},
    				{
    					name: '기록물 생성',
    					path: '/manage/cases/create'
    				}
    			]
    		},
    		{
    			name: '홈페이지',
    			sub_category: [{ name: '관리자 메인', path: '/manage' }, { name: '유저 메인', path: '/user' }]
    		},
    		{
    			name: '통계',
    			sub_category: [
    				{
    					name: '나의 통계',
    					path: '/manage/stats/user'
    				},
    				{ name: '기록물 생성', path: '/manage/stats' }
    			]
    		}
    	];

    	let selected_index = null;

    	function categorySelect(e) {
    		$$invalidate(0, selected_index = e.detail.index);
    	}

    	function categoryNavigate(e) {
    		f.goto(e.detail.path);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ManageSidebar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ManageCategory,
    		meta: O,
    		Route,
    		router: f,
    		categories,
    		selected_index,
    		categorySelect,
    		categoryNavigate
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) $$invalidate(1, categories = $$props.categories);
    		if ('selected_index' in $$props) $$invalidate(0, selected_index = $$props.selected_index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selected_index, categories, categorySelect, categoryNavigate];
    }

    class ManageSidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ManageSidebar",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* components/manager/BrowseTitle.svelte generated by Svelte v3.50.1 */
    const file$l = "components/manager/BrowseTitle.svelte";

    function create_fragment$p(ctx) {
    	let div9;
    	let h30;
    	let t1;
    	let div0;
    	let svg0;
    	let path0;
    	let t2;
    	let svg1;
    	let path1;
    	let t3;
    	let div8;
    	let div1;
    	let h31;
    	let t5;
    	let div7;
    	let div2;
    	let h32;
    	let t7;
    	let div3;
    	let h33;
    	let t9;
    	let div4;
    	let h34;
    	let t11;
    	let div5;
    	let h35;
    	let t13;
    	let div6;
    	let h36;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			h30 = element("h3");
    			h30.textContent = "기록물 조회";
    			t1 = space();
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t2 = space();
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t3 = space();
    			div8 = element("div");
    			div1 = element("div");
    			h31 = element("h3");
    			h31.textContent = "키워드:";
    			t5 = space();
    			div7 = element("div");
    			div2 = element("div");
    			h32 = element("h3");
    			h32.textContent = "#이인호_동상";
    			t7 = space();
    			div3 = element("div");
    			h33 = element("h3");
    			h33.textContent = "#김재우";
    			t9 = space();
    			div4 = element("div");
    			h34 = element("h3");
    			h34.textContent = "#학정원_배경";
    			t11 = space();
    			div5 = element("div");
    			h35 = element("h3");
    			h35.textContent = "#2022";
    			t13 = space();
    			div6 = element("div");
    			h36 = element("h3");
    			h36.textContent = "#배경화면";
    			attr_dev(h30, "class", "svelte-o9eyk7");
    			add_location(h30, file$l, 93, 8, 2178);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "d", "M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z");
    			add_location(path0, file$l, 96, 16, 2386);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-width", "2");
    			attr_dev(svg0, "stroke", "white");
    			attr_dev(svg0, "width", "18");
    			attr_dev(svg0, "height", "18");
    			add_location(svg0, file$l, 95, 12, 2241);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "d", "M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z");
    			add_location(path1, file$l, 99, 16, 2893);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "2");
    			attr_dev(svg1, "stroke", "white");
    			attr_dev(svg1, "width", "18");
    			attr_dev(svg1, "height", "18");
    			add_location(svg1, file$l, 98, 12, 2748);
    			attr_dev(div0, "class", "svg-holder svelte-o9eyk7");
    			add_location(div0, file$l, 94, 8, 2203);
    			attr_dev(h31, "class", "svelte-o9eyk7");
    			add_location(h31, file$l, 104, 16, 3366);
    			attr_dev(div1, "class", "keyword-holder-label svelte-o9eyk7");
    			add_location(div1, file$l, 103, 12, 3314);
    			attr_dev(h32, "class", "svelte-o9eyk7");
    			add_location(h32, file$l, 107, 37, 3480);
    			attr_dev(div2, "class", "keyword svelte-o9eyk7");
    			add_location(div2, file$l, 107, 16, 3459);
    			attr_dev(h33, "class", "svelte-o9eyk7");
    			add_location(h33, file$l, 108, 37, 3541);
    			attr_dev(div3, "class", "keyword svelte-o9eyk7");
    			add_location(div3, file$l, 108, 16, 3520);
    			attr_dev(h34, "class", "svelte-o9eyk7");
    			add_location(h34, file$l, 109, 37, 3599);
    			attr_dev(div4, "class", "keyword svelte-o9eyk7");
    			add_location(div4, file$l, 109, 16, 3578);
    			attr_dev(h35, "class", "svelte-o9eyk7");
    			add_location(h35, file$l, 110, 37, 3660);
    			attr_dev(div5, "class", "keyword svelte-o9eyk7");
    			add_location(div5, file$l, 110, 16, 3639);
    			attr_dev(h36, "class", "svelte-o9eyk7");
    			add_location(h36, file$l, 111, 37, 3719);
    			attr_dev(div6, "class", "keyword svelte-o9eyk7");
    			add_location(div6, file$l, 111, 16, 3698);
    			attr_dev(div7, "class", "keyword-holder svelte-o9eyk7");
    			add_location(div7, file$l, 106, 12, 3413);
    			attr_dev(div8, "class", "keyword-holder-wrap svelte-o9eyk7");
    			add_location(div8, file$l, 102, 8, 3267);
    			attr_dev(div9, "class", "browse-content-title svelte-o9eyk7");
    			add_location(div9, file$l, 92, 4, 2134);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, h30);
    			append_dev(div9, t1);
    			append_dev(div9, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div0, t2);
    			append_dev(div0, svg1);
    			append_dev(svg1, path1);
    			append_dev(div9, t3);
    			append_dev(div9, div8);
    			append_dev(div8, div1);
    			append_dev(div1, h31);
    			append_dev(div8, t5);
    			append_dev(div8, div7);
    			append_dev(div7, div2);
    			append_dev(div2, h32);
    			append_dev(div7, t7);
    			append_dev(div7, div3);
    			append_dev(div3, h33);
    			append_dev(div7, t9);
    			append_dev(div7, div4);
    			append_dev(div4, h34);
    			append_dev(div7, t11);
    			append_dev(div7, div5);
    			append_dev(div5, h35);
    			append_dev(div7, t13);
    			append_dev(div7, div6);
    			append_dev(div6, h36);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BrowseTitle', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BrowseTitle> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Route });
    	return [];
    }

    class BrowseTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BrowseTitle",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* components/manager/ManageCreateTitle.svelte generated by Svelte v3.50.1 */

    const file$m = "components/manager/ManageCreateTitle.svelte";

    function create_fragment$q(ctx) {
    	let div3;
    	let h30;
    	let t1;
    	let div0;
    	let svg0;
    	let path0;
    	let t2;
    	let svg1;
    	let path1;
    	let t3;
    	let div2;
    	let div1;
    	let h31;
    	let t4;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			h30 = element("h3");
    			h30.textContent = "기록물 생성";
    			t1 = space();
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t2 = space();
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t3 = space();
    			div2 = element("div");
    			div1 = element("div");
    			h31 = element("h3");
    			t4 = text(/*subtitle*/ ctx[0]);
    			attr_dev(h30, "class", "svelte-1wpj7h6");
    			add_location(h30, file$m, 68, 4, 1464);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "d", "M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z");
    			add_location(path0, file$m, 71, 12, 1660);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-width", "2");
    			attr_dev(svg0, "stroke", "white");
    			attr_dev(svg0, "width", "18");
    			attr_dev(svg0, "height", "18");
    			add_location(svg0, file$m, 70, 8, 1519);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "d", "M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z");
    			add_location(path1, file$m, 74, 12, 2155);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "2");
    			attr_dev(svg1, "stroke", "white");
    			attr_dev(svg1, "width", "18");
    			attr_dev(svg1, "height", "18");
    			add_location(svg1, file$m, 73, 8, 2014);
    			attr_dev(div0, "class", "svg-holder svelte-1wpj7h6");
    			add_location(div0, file$m, 69, 4, 1485);
    			attr_dev(h31, "class", "svelte-1wpj7h6");
    			add_location(h31, file$m, 79, 12, 2608);
    			attr_dev(div1, "class", "keyword-holder-label svelte-1wpj7h6");
    			add_location(div1, file$m, 78, 8, 2560);
    			attr_dev(div2, "class", "keyword-holder-wrap svelte-1wpj7h6");
    			add_location(div2, file$m, 77, 4, 2517);
    			attr_dev(div3, "class", "browse-content-title svelte-1wpj7h6");
    			add_location(div3, file$m, 67, 0, 1424);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, h30);
    			append_dev(div3, t1);
    			append_dev(div3, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div0, t2);
    			append_dev(div0, svg1);
    			append_dev(svg1, path1);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h31);
    			append_dev(h31, t4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*subtitle*/ 1) set_data_dev(t4, /*subtitle*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ManageCreateTitle', slots, []);
    	let { subtitle = '' } = $$props;
    	const writable_props = ['subtitle'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ManageCreateTitle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('subtitle' in $$props) $$invalidate(0, subtitle = $$props.subtitle);
    	};

    	$$self.$capture_state = () => ({ subtitle });

    	$$self.$inject_state = $$props => {
    		if ('subtitle' in $$props) $$invalidate(0, subtitle = $$props.subtitle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [subtitle];
    }

    class ManageCreateTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { subtitle: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ManageCreateTitle",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get subtitle() {
    		throw new Error("<ManageCreateTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error("<ManageCreateTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* components/user/UserInfo.svelte generated by Svelte v3.50.1 */

    const file$n = "components/user/UserInfo.svelte";

    function create_fragment$r(ctx) {
    	let div0;
    	let svg;
    	let path;
    	let t0;
    	let h30;
    	let t2;
    	let div6;
    	let div1;
    	let h31;
    	let t4;
    	let h40;
    	let t6;
    	let div2;
    	let h41;
    	let t8;
    	let h32;
    	let t10;
    	let div3;
    	let h42;
    	let t12;
    	let h33;
    	let t14;
    	let div4;
    	let h43;
    	let t16;
    	let h34;
    	let t18;
    	let div5;
    	let a0;
    	let h35;
    	let t20;
    	let a1;
    	let h36;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			h30 = element("h3");
    			h30.textContent = "회원정보";
    			t2 = space();
    			div6 = element("div");
    			div1 = element("div");
    			h31 = element("h3");
    			h31.textContent = "안상철";
    			t4 = space();
    			h40 = element("h4");
    			h40.textContent = "님";
    			t6 = space();
    			div2 = element("div");
    			h41 = element("h4");
    			h41.textContent = "소속";
    			t8 = space();
    			h32 = element("h3");
    			h32.textContent = "학술정보원 멀티미디어교실";
    			t10 = space();
    			div3 = element("div");
    			h42 = element("h4");
    			h42.textContent = "접속 주소";
    			t12 = space();
    			h33 = element("h3");
    			h33.textContent = "192.168.0.10";
    			t14 = space();
    			div4 = element("div");
    			h43 = element("h4");
    			h43.textContent = "최근접속";
    			t16 = space();
    			h34 = element("h3");
    			h34.textContent = "4시간 전";
    			t18 = space();
    			div5 = element("div");
    			a0 = element("a");
    			h35 = element("h3");
    			h35.textContent = "로그아웃";
    			t20 = space();
    			a1 = element("a");
    			h36 = element("h3");
    			h36.textContent = "정보수정";
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z");
    			add_location(path, file$n, 129, 8, 2973);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "rgb(247, 247, 247)");
    			attr_dev(svg, "width", "17");
    			attr_dev(svg, "height", "17");
    			attr_dev(svg, "class", "svelte-1sadpxu");
    			add_location(svg, file$n, 128, 4, 2823);
    			attr_dev(h30, "class", "svelte-1sadpxu");
    			add_location(h30, file$n, 131, 4, 3240);
    			attr_dev(div0, "class", "user-info-title svelte-1sadpxu");
    			add_location(div0, file$n, 127, 0, 2788);
    			attr_dev(h31, "class", "svelte-1sadpxu");
    			add_location(h31, file$n, 135, 8, 3340);
    			attr_dev(h40, "class", "svelte-1sadpxu");
    			add_location(h40, file$n, 136, 8, 3362);
    			attr_dev(div1, "class", "user-name-wrap svelte-1sadpxu");
    			add_location(div1, file$n, 134, 4, 3302);
    			attr_dev(h41, "class", "svelte-1sadpxu");
    			add_location(h41, file$n, 139, 8, 3440);
    			attr_dev(h32, "class", "svelte-1sadpxu");
    			add_location(h32, file$n, 140, 8, 3461);
    			attr_dev(div2, "class", "user-affiliation-wrap item svelte-1sadpxu");
    			add_location(div2, file$n, 138, 4, 3390);
    			attr_dev(h42, "class", "svelte-1sadpxu");
    			add_location(h42, file$n, 143, 8, 3542);
    			attr_dev(h33, "class", "svelte-1sadpxu");
    			add_location(h33, file$n, 144, 8, 3566);
    			attr_dev(div3, "class", "user-ip-wrap item svelte-1sadpxu");
    			add_location(div3, file$n, 142, 4, 3501);
    			attr_dev(h43, "class", "svelte-1sadpxu");
    			add_location(h43, file$n, 147, 8, 3650);
    			attr_dev(h34, "class", "svelte-1sadpxu");
    			add_location(h34, file$n, 148, 8, 3673);
    			attr_dev(div4, "class", "user-recent-wrap item svelte-1sadpxu");
    			add_location(div4, file$n, 146, 4, 3605);
    			attr_dev(h35, "href", "/logout");
    			attr_dev(h35, "class", "svelte-1sadpxu");
    			add_location(h35, file$n, 152, 12, 3806);
    			attr_dev(a0, "class", "logout-btn-wrap svelte-1sadpxu");
    			attr_dev(a0, "href", "/logout");
    			add_location(a0, file$n, 151, 8, 3750);
    			attr_dev(h36, "href", "/user/change");
    			attr_dev(h36, "class", "svelte-1sadpxu");
    			add_location(h36, file$n, 157, 12, 3959);
    			attr_dev(a1, "class", "change-account-btn-wrap svelte-1sadpxu");
    			attr_dev(a1, "href", "/user/change");
    			add_location(a1, file$n, 156, 8, 3890);
    			attr_dev(div5, "class", "user-btn-control-wrap svelte-1sadpxu");
    			add_location(div5, file$n, 150, 4, 3705);
    			attr_dev(div6, "class", "user-info-container svelte-1sadpxu");
    			add_location(div6, file$n, 133, 0, 3263);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, svg);
    			append_dev(svg, path);
    			append_dev(div0, t0);
    			append_dev(div0, h30);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div1);
    			append_dev(div1, h31);
    			append_dev(div1, t4);
    			append_dev(div1, h40);
    			append_dev(div6, t6);
    			append_dev(div6, div2);
    			append_dev(div2, h41);
    			append_dev(div2, t8);
    			append_dev(div2, h32);
    			append_dev(div6, t10);
    			append_dev(div6, div3);
    			append_dev(div3, h42);
    			append_dev(div3, t12);
    			append_dev(div3, h33);
    			append_dev(div6, t14);
    			append_dev(div6, div4);
    			append_dev(div4, h43);
    			append_dev(div4, t16);
    			append_dev(div4, h34);
    			append_dev(div6, t18);
    			append_dev(div6, div5);
    			append_dev(div5, a0);
    			append_dev(a0, h35);
    			append_dev(div5, t20);
    			append_dev(div5, a1);
    			append_dev(a1, h36);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserInfo', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserInfo> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class UserInfo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserInfo",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* pages/ManageBrowse/ManageBrowse.svelte generated by Svelte v3.50.1 */
    const file$o = "pages/ManageBrowse/ManageBrowse.svelte";

    // (129:12) <Route path="/browse/*">
    function create_default_slot_2(ctx) {
    	let browsetitle;
    	let t0;
    	let contentcontainer;
    	let t1;
    	let div;
    	let browsenavbar;
    	let current;
    	browsetitle = new BrowseTitle({ $$inline: true });

    	contentcontainer = new ContentContainer({
    			props: { page: /*page*/ ctx[1] },
    			$$inline: true
    		});

    	contentcontainer.$on("pageChange", /*pageHandle*/ ctx[5]);
    	contentcontainer.$on("focus", /*focusHandle*/ ctx[6]);

    	browsenavbar = new BrowseNavbar({
    			props: {
    				page: /*page*/ ctx[1],
    				focus: /*focus*/ ctx[2]
    			},
    			$$inline: true
    		});

    	browsenavbar.$on("pageChange", /*pageHandle*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(browsetitle.$$.fragment);
    			t0 = space();
    			create_component(contentcontainer.$$.fragment);
    			t1 = space();
    			div = element("div");
    			create_component(browsenavbar.$$.fragment);
    			attr_dev(div, "class", "bottom-bar svelte-j12i23");
    			add_location(div, file$o, 131, 16, 3165);
    		},
    		m: function mount(target, anchor) {
    			mount_component(browsetitle, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(contentcontainer, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(browsenavbar, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contentcontainer_changes = {};
    			if (dirty & /*page*/ 2) contentcontainer_changes.page = /*page*/ ctx[1];
    			contentcontainer.$set(contentcontainer_changes);
    			const browsenavbar_changes = {};
    			if (dirty & /*page*/ 2) browsenavbar_changes.page = /*page*/ ctx[1];
    			if (dirty & /*focus*/ 4) browsenavbar_changes.focus = /*focus*/ ctx[2];
    			browsenavbar.$set(browsenavbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(browsetitle.$$.fragment, local);
    			transition_in(contentcontainer.$$.fragment, local);
    			transition_in(browsenavbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(browsetitle.$$.fragment, local);
    			transition_out(contentcontainer.$$.fragment, local);
    			transition_out(browsenavbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(browsetitle, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(contentcontainer, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(browsenavbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(129:12) <Route path=\\\"/browse/*\\\">",
    		ctx
    	});

    	return block;
    }

    // (137:12) <Route path="/create">
    function create_default_slot_1(ctx) {
    	let managecreatetitle;
    	let t0;
    	let managecreatecontainer;
    	let t1;
    	let div;
    	let managecreatenavbar;
    	let current;

    	managecreatetitle = new ManageCreateTitle({
    			props: { subtitle: /*subtitle*/ ctx[3] },
    			$$inline: true
    		});

    	managecreatecontainer = new ManageCreateContainer({
    			props: { stage: /*stage*/ ctx[0] },
    			$$inline: true
    		});

    	managecreatenavbar = new ManageCreateNavbar({
    			props: { stage: /*stage*/ ctx[0] },
    			$$inline: true
    		});

    	managecreatenavbar.$on("stageChange", /*stageHandle*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(managecreatetitle.$$.fragment);
    			t0 = space();
    			create_component(managecreatecontainer.$$.fragment);
    			t1 = space();
    			div = element("div");
    			create_component(managecreatenavbar.$$.fragment);
    			attr_dev(div, "class", "bottom-bar svelte-j12i23");
    			add_location(div, file$o, 139, 16, 3496);
    		},
    		m: function mount(target, anchor) {
    			mount_component(managecreatetitle, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(managecreatecontainer, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(managecreatenavbar, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const managecreatetitle_changes = {};
    			if (dirty & /*subtitle*/ 8) managecreatetitle_changes.subtitle = /*subtitle*/ ctx[3];
    			managecreatetitle.$set(managecreatetitle_changes);
    			const managecreatecontainer_changes = {};
    			if (dirty & /*stage*/ 1) managecreatecontainer_changes.stage = /*stage*/ ctx[0];
    			managecreatecontainer.$set(managecreatecontainer_changes);
    			const managecreatenavbar_changes = {};
    			if (dirty & /*stage*/ 1) managecreatenavbar_changes.stage = /*stage*/ ctx[0];
    			managecreatenavbar.$set(managecreatenavbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(managecreatetitle.$$.fragment, local);
    			transition_in(managecreatecontainer.$$.fragment, local);
    			transition_in(managecreatenavbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(managecreatetitle.$$.fragment, local);
    			transition_out(managecreatecontainer.$$.fragment, local);
    			transition_out(managecreatenavbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(managecreatetitle, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(managecreatecontainer, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(managecreatenavbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(137:12) <Route path=\\\"/create\\\">",
    		ctx
    	});

    	return block;
    }

    // (120:0) <Route path="/*">
    function create_default_slot$1(ctx) {
    	let div0;
    	let managesidebar;
    	let t0;
    	let div2;
    	let div1;
    	let route0;
    	let t1;
    	let route1;
    	let t2;
    	let route2;
    	let t3;
    	let div3;
    	let userinfo;
    	let current;
    	managesidebar = new ManageSidebar({ $$inline: true });

    	route0 = new Route({
    			props: {
    				path: "/",
    				redirect: "/manage/cases/browse"
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/browse/*",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/create",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	userinfo = new UserInfo({ $$inline: true });

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(managesidebar.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(route0.$$.fragment);
    			t1 = space();
    			create_component(route1.$$.fragment);
    			t2 = space();
    			create_component(route2.$$.fragment);
    			t3 = space();
    			div3 = element("div");
    			create_component(userinfo.$$.fragment);
    			attr_dev(div0, "class", "manage-sidebar-wrap svelte-j12i23");
    			add_location(div0, file$o, 120, 4, 2749);
    			attr_dev(div1, "class", "browse-content-wrap svelte-j12i23");
    			add_location(div1, file$o, 124, 8, 2870);
    			attr_dev(div2, "class", "manage-content-main svelte-j12i23");
    			add_location(div2, file$o, 123, 4, 2827);
    			attr_dev(div3, "class", "user-info-wrap svelte-j12i23");
    			add_location(div3, file$o, 146, 4, 3688);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(managesidebar, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			mount_component(route0, div1, null);
    			append_dev(div1, t1);
    			mount_component(route1, div1, null);
    			append_dev(div1, t2);
    			mount_component(route2, div1, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div3, anchor);
    			mount_component(userinfo, div3, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route1_changes = {};

    			if (dirty & /*$$scope, page, focus*/ 1030) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope, stage, subtitle*/ 1033) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(managesidebar.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(userinfo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(managesidebar.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(userinfo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(managesidebar);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div3);
    			destroy_component(userinfo);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(120:0) <Route path=\\\"/*\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let route;
    	let current;

    	route = new Route({
    			props: {
    				path: "/*",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route_changes = {};

    			if (dirty & /*$$scope, stage, subtitle, page, focus*/ 1039) {
    				route_changes.$$scope = { dirty, ctx };
    			}

    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function titleChange(stage) {
    	if (stage == 1) {
    		return '메타데이터 등록';
    	} else if (stage == 2) {
    		return '기록물 파일 등록';
    	} else if (stage == 3) {
    		return '내용 등록';
    	} else if (stage == 4) {
    		return '미리보기';
    	}

    	return '허가되지 않은 창';
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ManageBrowse', slots, []);
    	let categories = ["기록물", "통계", "홈페이지로 가기"];
    	let selected_index = null;
    	let page = 1;
    	let stage = 1;
    	let focus = false;
    	let subtitle = '';

    	function categorySelect(e) {
    		selected_index = e.detail.index;
    	}

    	function stageHandle(e) {
    		$$invalidate(0, stage = e.detail.stage);
    	}

    	function pageHandle(e) {
    		$$invalidate(1, page = e.detail.page);
    	}

    	function focusHandle(e) {
    		$$invalidate(2, focus = e.detail.focus);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ManageBrowse> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ContentContainer,
    		ManageCreateContainer,
    		BrowseNavbar,
    		ManageCreateNavbar,
    		ManageSidebar,
    		BrowseTitle,
    		ManageCreateTitle,
    		UserInfo,
    		meta: O,
    		Route,
    		categories,
    		selected_index,
    		page,
    		stage,
    		focus,
    		subtitle,
    		categorySelect,
    		stageHandle,
    		pageHandle,
    		focusHandle,
    		titleChange
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) categories = $$props.categories;
    		if ('selected_index' in $$props) selected_index = $$props.selected_index;
    		if ('page' in $$props) $$invalidate(1, page = $$props.page);
    		if ('stage' in $$props) $$invalidate(0, stage = $$props.stage);
    		if ('focus' in $$props) $$invalidate(2, focus = $$props.focus);
    		if ('subtitle' in $$props) $$invalidate(3, subtitle = $$props.subtitle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*stage*/ 1) {
    			 {
    				$$invalidate(3, subtitle = titleChange(stage));
    			}
    		}
    	};

    	return [stage, page, focus, subtitle, stageHandle, pageHandle, focusHandle];
    }

    class ManageBrowse extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ManageBrowse",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* pages/Help.svelte generated by Svelte v3.50.1 */

    function create_fragment$t(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Help', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Help> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Help extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Help",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* pages/Stats.svelte generated by Svelte v3.50.1 */

    function create_fragment$u(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Stats', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Stats> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Stats extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Stats",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* pages/Accounts.svelte generated by Svelte v3.50.1 */

    function create_fragment$v(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Accounts', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Accounts> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Accounts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Accounts",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* App.svelte generated by Svelte v3.50.1 */
    const file$p = "App.svelte";

    // (90:4) <Route path="/" redirect="/user">
    function create_default_slot_6(ctx) {
    	let usermain;
    	let current;
    	usermain = new UserMain({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(usermain.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(usermain, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usermain.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usermain.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usermain, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(90:4) <Route path=\\\"/\\\" redirect=\\\"/user\\\">",
    		ctx
    	});

    	return block;
    }

    // (95:8) <Route path="/">
    function create_default_slot_5(ctx) {
    	let usermain;
    	let current;
    	usermain = new UserMain({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(usermain.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(usermain, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usermain.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usermain.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usermain, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(95:8) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (98:8) <Route path="/browse/*">
    function create_default_slot_4(ctx) {
    	let usernavbar;
    	let t;
    	let browse;
    	let current;
    	usernavbar = new UserNavbar({ $$inline: true });
    	browse = new Browse({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(usernavbar.$$.fragment);
    			t = space();
    			create_component(browse.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(usernavbar, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(browse, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usernavbar.$$.fragment, local);
    			transition_in(browse.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usernavbar.$$.fragment, local);
    			transition_out(browse.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usernavbar, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(browse, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(98:8) <Route path=\\\"/browse/*\\\">",
    		ctx
    	});

    	return block;
    }

    // (94:4) <Route path="/user/*">
    function create_default_slot_3(ctx) {
    	let route0;
    	let t;
    	let route1;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/browse/*",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t = space();
    			create_component(route1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(route1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(route1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(94:4) <Route path=\\\"/user/*\\\">",
    		ctx
    	});

    	return block;
    }

    // (106:8) <Route path="/">
    function create_default_slot_2$1(ctx) {
    	let managemain;
    	let current;
    	managemain = new ManageMain({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(managemain.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(managemain, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(managemain.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(managemain.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(managemain, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(106:8) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (109:8) <Route path="/cases/*">
    function create_default_slot_1$1(ctx) {
    	let managebrowse;
    	let current;
    	managebrowse = new ManageBrowse({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(managebrowse.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(managebrowse, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(managebrowse.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(managebrowse.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(managebrowse, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(109:8) <Route path=\\\"/cases/*\\\">",
    		ctx
    	});

    	return block;
    }

    // (104:4) <Route path="/manage/*">
    function create_default_slot$2(ctx) {
    	let managenavbar;
    	let t0;
    	let route0;
    	let t1;
    	let route1;
    	let current;
    	managenavbar = new ManageNavbar({ $$inline: true });

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/cases/*",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(managenavbar.$$.fragment);
    			t0 = space();
    			create_component(route0.$$.fragment);
    			t1 = space();
    			create_component(route1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(managenavbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(route0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(managenavbar.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(managenavbar.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(managenavbar, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(route1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(104:4) <Route path=\\\"/manage/*\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let main;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let footer;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/",
    				redirect: "/user",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/user/*",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/manage/*",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(main, "class", "svelte-quo68e");
    			add_location(main, file$p, 88, 0, 1869);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(route0, main, null);
    			append_dev(main, t0);
    			mount_component(route1, main, null);
    			append_dev(main, t1);
    			mount_component(route2, main, null);
    			append_dev(main, t2);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Route,
    		UserNavbar,
    		ManageNavbar,
    		Footer,
    		UserMain,
    		Browse,
    		ManageMain,
    		ManageBrowse,
    		Help,
    		Stats,
    		Accounts
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$w.name
    		});
    	}
    }

    const app = new App({
      target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
