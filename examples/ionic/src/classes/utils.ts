export class Utils {
    // Converts from degrees to radians.
    public static radians(degrees) {
        return degrees * Math.PI / 180
    }

    // Converts from radians to degrees.
    public static degrees(radians) {
        return radians * 180 / Math.PI
    }
}
