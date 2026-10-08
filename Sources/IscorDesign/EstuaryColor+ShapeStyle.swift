import SwiftUI

/// An `EstuaryColor` is a SwiftUI style by itself, resolved against the colour scheme of the view it is drawn in:
///
///     Text("Bonjour")
///         .foregroundStyle(Estuary.ink)
///         .background(Estuary.card, in: .rect(cornerRadius: Estuary.Radius.lg))
extension EstuaryColor: ShapeStyle {
    public func resolve(in environment: EnvironmentValues) -> Color.Resolved {
        let c = components(dark: environment.colorScheme == .dark)
        return Color.Resolved(colorSpace: .sRGB, red: Float(c.red), green: Float(c.green), blue: Float(c.blue), opacity: Float(c.alpha))
    }
}
