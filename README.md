# Pose Search Native

This is the native version of [Pose Search](x6ud.github.io/pose-search) for local photos.

## Download

[Windows](https://github.com/x6ud/pose-search-native/releases)

For Linux and macOS: I only have a windows machine so please try to build it yourself 😓

## Problems

#### Can't run the exe?

- It may be because the port it occupied, try modifying the port number in the .env file.

#### Error pops up during scanning?

- Refresh the page and click scan again.

#### The 3D model is not displayed?

- Check if the browser has WebGL enabled.

## Project setup

```
npm install
```

## Development

In `/ui`

```
npm run dev
```

In `/server`
```
npm run build
```
then
```
npm run dev
```

## Build
In `/ui`

```
npm run build
```
In `/server`

```
npm run build
```
And

```
npm run pack
```
See https://github.com/nexe/nexe