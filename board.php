<?php 
	Header("Content-type: text/xml");
	echo('<?xml version="1.0"?>');
?>
<board width="200" height="300" type="solid" color="CCFFCC">
    <player id="Me" color="0000CC" icon="myIcon" />
    <player id="You" color="CC0000" icon="yourIcon" />
    <icon id="myIcon" shape="square" diameter="30" initX="124" initY="124" />
    <icon id="yourIcon" shape="circle" diameter="30" initX="20" initY="200" />
</board>
