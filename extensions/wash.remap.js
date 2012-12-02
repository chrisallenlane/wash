/**
 * This object makes it possible to rewrite one shell command to another. This
 * can be used not only for simple "macro" capability, but also to implement a
 * thin compatibility layer between the web shell and the Unix system, where
 * necessary.
 */
wash.remap = {};

// turn off highlighting in `cal` - it will display weirdly in the wash output
wash.remap['cal'] = 'cal -h';
