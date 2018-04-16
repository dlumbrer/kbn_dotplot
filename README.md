# Dotplot for Kibana

This is a plugin developed for Kibana 5 that you can build dotplot vis


## Installation Steps from release

Now this plugin is avalible for differents versions of Kibana (6, 5), in [releases](https://github.com/dlumbrer/kbn_dotplot/releases "Go to releases!") you can download the plugin with all its dependencies installed:

1. Go to [releases](https://github.com/dlumbrer/kbn_dotplot/releases "Go to releases!") and download the right one for your Kibana
2. unzip/untar it into `KIBANA_HOME/plugins`
3. Start your Kibana


## Installation Steps from GitHub source code

1. Move into plugins folder:  `cd KIBANA_HOME/plugins`
2. Clone the source code (**it depends on your Kibana's version**):
    - Kibana 6: `git clone https://github.com/dlumbrer/kbn_dotplot.git -b 6-dev`
    - Kibana 5.5.X or 5.6.X: `git clone https://github.com/dlumbrer/kbn_dotplot.git -b 5.5.x`
    - Kibana 5.4.X: `git clone https://github.com/dlumbrer/kbn_dotplot.git -b 5.4.x`

3. Install dependencies:
      ```
      cd kbn_dotplot
      rm -rf images/
      npm install
      ```
4. Start Kibana

> **Important:** If you have any problem with the plugin version (like a warning message "**it expected Kibana version "x.x.x", and found "x.x.x"**") only change the value of the "version" tag on the package.json to your Kibana version


#### Uninstall:
```
cd KIBANA_HOME
rm -rf plugins/kbn_dotplot/
```


# Example of use

![Example](images/dotplotsample.png)


## Help me to improve! :smile:

If there's any problem or doubt, please, open a Github Issue (Pull Request) or contact me via email (dmorenolumb@gmail.com). It would be very helpful if you tried it and tell me what you think of it, the errors and the possible improves that I could make.


#### For anything, contact me: dmorenolumb@gmail.com
