<?php

/*
 * PHP-Base64 (https://github.com/delight-im/PHP-Base64)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

use Delight\Base64\Base64;

error_reporting(E_ALL);
ini_set('display_errors', 'stdout');

header('Content-type: text/plain; charset=utf-8');

require __DIR__ . '/../vendor/autoload.php';

(Base64::encode('Gallia est omnis divisa in partes tres') === 'R2FsbGlhIGVzdCBvbW5pcyBkaXZpc2EgaW4gcGFydGVzIHRyZXM=') or exit('Failed on line ' . __LINE__);
(Base64::decode('R2FsbGlhIGVzdCBvbW5pcyBkaXZpc2EgaW4gcGFydGVzIHRyZXM=') === 'Gallia est omnis divisa in partes tres') or exit('Failed on line ' . __LINE__);
(Base64::encodeUrlSafe('πάντα χωρεῖ καὶ οὐδὲν μένει …') === 'z4DOrM69z4TOsSDPh8-Jz4HOteG_liDOus6x4b22IM6_4b2QzrThvbLOvSDOvM6tzr3Otc65IOKApg~~') or exit('Failed on line ' . __LINE__);
(Base64::decodeUrlSafe('z4DOrM69z4TOsSDPh8-Jz4HOteG_liDOus6x4b22IM6_4b2QzrThvbLOvSDOvM6tzr3Otc65IOKApg~~') === 'πάντα χωρεῖ καὶ οὐδὲν μένει …') or exit('Failed on line ' . __LINE__);
(Base64::encodeUrlSafeWithoutPadding('πάντα χωρεῖ καὶ οὐδὲν μένει …') === 'z4DOrM69z4TOsSDPh8-Jz4HOteG_liDOus6x4b22IM6_4b2QzrThvbLOvSDOvM6tzr3Otc65IOKApg') or exit('Failed on line ' . __LINE__);
(Base64::decodeUrlSafeWithoutPadding('z4DOrM69z4TOsSDPh8-Jz4HOteG_liDOus6x4b22IM6_4b2QzrThvbLOvSDOvM6tzr3Otc65IOKApg') === 'πάντα χωρεῖ καὶ οὐδὲν μένει …') or exit('Failed on line ' . __LINE__);

for ($i = 0; $i < 1000; $i++) {
	$data = openssl_random_pseudo_bytes(mt_rand(12, 24));

	(Base64::decode(Base64::encode($data)) === $data) or exit('Failed on line ' . __LINE__);
	(Base64::decodeUrlSafe(Base64::encodeUrlSafe($data)) === $data) or exit('Failed on line ' . __LINE__);
	(Base64::decodeUrlSafeWithoutPadding(Base64::encodeUrlSafeWithoutPadding($data)) === $data) or exit('Failed on line ' . __LINE__);
}

echo 'ALL TESTS PASSED';
echo "\n";
