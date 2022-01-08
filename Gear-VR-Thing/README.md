The Gradle Wrapper
------------------

**OS X**

    brew install gradle
    export ANDROID_HOME=~/Library/Android/sdk
    gradle wrapper --gradle-version 3.3

**Windows**

    choco install gradle
    $env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jre'
    $env:ANDROID_HOME = $HOME + '\AppData\Local\Android\sdk'
    gradle wrapper --gradle-version 3.3
