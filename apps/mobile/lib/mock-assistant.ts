export function getMockAssistantMessage(): string {
  return `
Alright, let's get this done! Here's a breakdown of your request with code, data, and some fun extras.

---

## 1. Zig Pointer to a Float64

In Zig, a pointer to a \`f64\` (float64) is declared with \`*f64\`.

Here's a simple example:

\`\`\`zig
const std = @import("std");

pub fn main() !void {
    var my_float: f64 = 3.14159;
    var float_ptr: *f64 = &my_float; // Taking the address of my_float

    std.debug.print("Original float: {d}\\n", .{my_float});
    std.debug.print("Value through pointer: {d}\\n", .{float_ptr.*}); // Dereferencing the pointer

    // We can also modify the value through the pointer
    float_ptr.* = 2.71828;

    std.debug.print("Modified float: {d}\\n", .{my_float});
    std.debug.print("Value through pointer after modification: {d}\\n", .{float_ptr.*});
}
\`\`\`

---

## 2. Table of 10 Countries and Their Currency/Tourist Activities

| Rank | Country       | Currency                 | Primary Tourist Activities                          |
| :--- | :------------ | :----------------------- | :------------------------------------------------- |
| 1    | France        | Euro (€)                 | Paris, Louvre, French Riviera                      |
| 2    | Japan         | Japanese Yen (JPY)       | Tokyo, Kyoto temples, Cherry blossoms              |
| 3    | Italy         | Euro (€)                 | Rome, Venice, Florence                             |
| 4    | United States | US Dollar (USD)          | National parks, NYC, West Coast                    |
| 5    | Spain         | Euro (€)                 | Barcelona, Seville, beaches                        |
| 6    | Greece        | Euro (€)                 | Islands, Acropolis                                 |
| 7    | Thailand      | Thai Baht (THB)          | Bangkok, islands, street food                      |
| 8    | Canada        | Canadian Dollar (CAD)    | Rockies, lakes, cities                             |
| 9    | Australia     | Australian Dollar (AUD)  | Sydney, Great Barrier Reef                         |
| 10   | Morocco       | Moroccan Dirham (MAD)    | Marrakech, Sahara, Atlas Mountains                 |

---

## 3. Random GitHub Link

Check this out: [Awesome Lists](https://github.com/sindresorhus/awesome)

---

## 4. Random Advice

**"Don't be afraid to ask 'why' repeatedly. It's the fastest way to truly understand something beyond the surface."**
`;
}
