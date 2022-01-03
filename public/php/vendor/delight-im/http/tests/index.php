<?php

/*
 * PHP-HTTP (https://github.com/delight-im/PHP-HTTP)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

// enable error reporting
use Delight\Http\ResponseHeader;

error_reporting(E_ALL);
ini_set('display_errors', 'stdout');

// enable assertions
ini_set('assert.active', 1);
ini_set('zend.assertions', 1);
ini_set('assert.exception', 1);

header('Content-type: text/plain; charset=utf-8');

require __DIR__ . '/../vendor/autoload.php';

define('TEST_HEADER_NAME', 'X-PHP-HTTP-Test');
define('TEST_HEADER_VALUE', 42);
define('TEST_HEADER', TEST_HEADER_NAME . ': ' . TEST_HEADER_VALUE);

ResponseHeader::set(TEST_HEADER_NAME, TEST_HEADER_VALUE);
assert(ResponseHeader::get(TEST_HEADER_NAME) === TEST_HEADER) or exit;
assert(ResponseHeader::get('Content-type') === 'Content-type: text/plain; charset=utf-8') or exit;
assert(ResponseHeader::get('Content-type', 'text/p') === 'Content-type: text/plain; charset=utf-8') or exit;
assert(ResponseHeader::get('Content-type', 'text/h') === null) or exit;

ResponseHeader::remove(TEST_HEADER_NAME, 'a');
assert(ResponseHeader::get(TEST_HEADER_NAME) === TEST_HEADER) or exit;

ResponseHeader::remove(TEST_HEADER_NAME, substr(TEST_HEADER_VALUE, 0, 4));
assert(ResponseHeader::get(TEST_HEADER_NAME) === null) or exit;

ResponseHeader::set(TEST_HEADER_NAME, TEST_HEADER_VALUE);
assert(ResponseHeader::get(TEST_HEADER_NAME) === TEST_HEADER) or exit;

assert(ResponseHeader::take(TEST_HEADER_NAME) === TEST_HEADER) or exit;
assert(ResponseHeader::get(TEST_HEADER_NAME) === null) or exit;

echo 'ALL TESTS PASSED' . "\n";
