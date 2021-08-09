# Problems

## How do I make the bars fit properly?
**Problem**: I can't get the bars to perfectly fit height of the screen.
They're either too short or they go off the bottom.

**Solution**: Put everything inside a flex container and set the body's height
to 100%. By constraining the body's height, if everything stays inside of it
then the screen won't scroll. I can setup a vertical flexbox for the
header and bars container, then a horizontal flexbox for the bars themselves.
The bar heights can range from 0-100% and will automatically have the correct
height and width