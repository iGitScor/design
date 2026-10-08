// swift-tools-version:6.0
import PackageDescription

// The design system for Swift apps: the tokens as EstuaryColor values (light and dark), the radii and the font
// (Outfit, bundled: SIL OFL, see Sources/IscorDesign/Fonts/OFL.txt).
//   .package(url: "https://github.com/iGitScor/design", from: "0.2.0")
let package = Package(
    name: "IscorDesign",
    platforms: [.macOS(.v14), .iOS(.v17)],
    products: [.library(name: "IscorDesign", targets: ["IscorDesign"])],
    targets: [
        .target(
            name: "IscorDesign", path: "Sources/IscorDesign",
            resources: [.copy("Fonts/Outfit.ttf"), .copy("Fonts/OFL.txt")]
        ),
        .testTarget(name: "IscorDesignTests", dependencies: ["IscorDesign"], path: "Tests/IscorDesignTests"),
    ]
)
