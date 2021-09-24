<?php
// Include users stuff
include_once $_SERVER["DOCUMENT_ROOT"]."/generateur/php/users.php";

?>

<!doctype html>

<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Generator²</title>
    <link rel="stylesheet" href="/generateur/css/normalize.css">
    <link rel="stylesheet" href="/generateur/css/common.css">
    <link rel="stylesheet" href="/generateur/css/about.css">
</head>
<body>
    <div id="div_content">
        <?php include $_SERVER["DOCUMENT_ROOT"]."/generateur/pages/header.php"?>

        <div id="div_main_content_wrapper">

            <h1>Hello and welcome!</h1>

            <p>
                You may have some questions about this website. What is it? What's the point? How does it work? Is there more to come? This page will hopefully answer some of these.
            </p>

            <h2>What is this all about?</h2>

            <p>
                If you've been on the web for long enough, you may have seen a lot of websites that offer generators, from <a href="https://www.fantasynamegenerators.com/">fantasy names</a> to <a href="https://www.random.org/">random number generator</a>, from <a href="https://www.cfsl.net/poule-de-cristal/">sketch ideas</a> (in french) to <a href="https://fr.fakenamegenerator.com/">completely fake identities</a>. Well, this is a bit like that.
            </p>

            <p>
                At first, all I wanted to do was a generator like <a href="https://www.cfsl.net/poule-de-cristal/">Poule de Cristal</a> (the sketch idea generator), but for stories. See, I dabble a bit in writing, and sometimes, getting inspiration is as simple as smashing ideas together. However, I wanted something a bit more… structured. So, rather than a generator spouting things like "An elf kidnapped by a vampire finds the key to a spaceship", I would prefer a generator producing something like "A fantasy story, written like a series of letters ; a mystery with a comical tone", and then maybe throw in some themes and additional details. Constraints, in form, are as interesting as raw ideas, and can also produce a spark of inspiration.
            </p>

            <p>
                Originally, this was then supposed to be a generator of stories. No more than that... Until I 
                thought: "Wouldn't it be fun if people could edit the generator? Not everyone will agree with how I 
                divided stories, and genres are a thing  people don't always agree on. But if I do that, I may as well offer a whole editor, so that people can create their own generators. And then, people may want to use multiple generators side by side…"
            </p>

            <p>
                You get the idea: soon enough, I was creating a small web application that would allow people to create simple generators to generate… well, random things! Whatever they wanted. And that is all there is to this website.
            </p>

            <h2>How does it work?</h2>

            <p>
                From a standard user viewpoint, all you have to do is go to the <a href="/generateur/pages/index.php">GENERATOR²</a> page (you can also click on the text in the middle of the header menu). There, you will see the generator, with the basic Story Structure template loaded. Click on the Generate button and see what happens! Then you may click around a bit more, try to load other common templates (I tried to make a few myself), change the categories, lock elements, and so on. Just fiddle with it.
            </p>

            <p>
                If you want to use the whole app, especially the Editor, you'll have to create an account. FAIR WARNING: this is not, by any means, a very secure website. Your passwords are encrypted, of course, but there is not a lot of protection as of now server-side. I will try to put more and more protections as time goes on, but right now, anyone sufficiently motivated could theoretically attack this website and succeed. Well, they would not get much, given that there is not really a whole lot of information, but still.
            </p>

            <p>
                From a technical standpoint, this whole website was made with the usual and traditional mix of HTML/CSS, PHP and Javascript. Vanilla Javascript, however. No React. No Angular. Also, no external dependencies. I will try to put the whole code out there (probably on GitHub), but inspecting the webpage should already give you all that's happening clientside, which is a lot!
            </p>

            <p>
                The fact that I'm using vanilla Javascript does not make this website friendly to all browsers! For example, older versions of Internet Explorer (IE 8 and below) won't work properly. If you're reading this and are using an older browser, wondering why this cool website is not working, this is the reason. And if you want me to fix it, I'm sorry, but I won't: older browsers are a nightmare to code around. Just update your browser already.
            </p>

            <h2>Is there more to come?</h2>

            <p>
                Although the core idea has been done, I would like to add some more functionalities, of course. However, each will take an increasing amount of time, so we'll see. Some of those updates would hopefully include:
                <ul>
                    <li>Sub-categories: categories that can be nested inside other categories.</li>
                    <li>Logical operators: Between templates or categories, to have some more nuanced controls on the generator.</li>
                    <li>Weighted elements: We may want some elements to appear more often than others. This would be a way to do that.</li>
                    <li>More user-oriented features: Copying the template of someone else, and/or subscribing to their template (and therefore all subsequent updates from them would be done to yours).</li>
                    <li>Importing categories: Importing categories from another template, adding them and the elements to another template.</li>
                    <li>Non-destructive editing: As of now, any modification to a template (even just the name!) will delete all settings from this user linked to this template. If possible, the code should try to keep the settings if they still work, and only remove them if the structure of the template itself was changed.</li>
                </ul>
            </p>

            <p>
                Some of those ideas are quite feasible, others will require some time, but I plan on working on this website frome time to time.
            </p>

            <h1>Thank you for reading!</h1>

            <p>I hope that you'll have some fun using this little generator, and won't find too many bugs. Thanks again!</p>
        </div>
    </div>
</body>
</html>