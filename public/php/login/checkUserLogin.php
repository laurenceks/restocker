<?php
require 'vendor/autoload.php';
use Delight\Auth\Auth;

require_once "db.php";

$auth = new Auth($db);

echo json_encode($auth->isLoggedIn());