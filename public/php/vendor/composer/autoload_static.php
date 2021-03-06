<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

use Closure;

class ComposerStaticInit1ed70e8449c2e7fcc1600d597863f161 {
    public static $prefixLengthsPsr4 = array('P' => array('PHPMailer\\PHPMailer\\' => 20,), 'D' => array('Delight\\Http\\' => 13, 'Delight\\Db\\' => 11, 'Delight\\Cookie\\' => 15, 'Delight\\Base64\\' => 15, 'Delight\\Auth\\' => 13,),);

    public static $prefixDirsPsr4 = array('PHPMailer\\PHPMailer\\' => array(0 => __DIR__ . '/..' . '/phpmailer/phpmailer/src',), 'Delight\\Http\\' => array(0 => __DIR__ . '/..' . '/delight-im/http/src',), 'Delight\\Db\\' => array(0 => __DIR__ . '/..' . '/delight-im/db/src',), 'Delight\\Cookie\\' => array(0 => __DIR__ . '/..' . '/delight-im/cookie/src',), 'Delight\\Base64\\' => array(0 => __DIR__ . '/..' . '/delight-im/base64/src',), 'Delight\\Auth\\' => array(0 => __DIR__ . '/..' . '/delight-im/auth/src',),);

    public static $classMap = array('Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',);

    public static function getInitializer(ClassLoader $loader) {
        return Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit1ed70e8449c2e7fcc1600d597863f161::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit1ed70e8449c2e7fcc1600d597863f161::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit1ed70e8449c2e7fcc1600d597863f161::$classMap;

        }, null, ClassLoader::class);
    }
}
