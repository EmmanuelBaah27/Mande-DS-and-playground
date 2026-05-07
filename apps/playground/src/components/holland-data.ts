export type HollandType = "R" | "I" | "A" | "S" | "E" | "C"

export type LikertValue = 1 | 2 | 3 | 4

export interface HollandQuestion {
  id: number
  text: string
  type: HollandType
}

export interface HollandTypeDefinition {
  name: string
  bracket: string
  likes: string
  thrives: string
}

export const HOLLAND_QUESTIONS: HollandQuestion[] = [
  { id: 1,  text: "I like to work on cars",                                    type: "R" },
  { id: 2,  text: "I like to do puzzles",                                      type: "I" },
  { id: 3,  text: "I am good at working independently",                        type: "A" },
  { id: 4,  text: "I like to work in teams",                                   type: "S" },
  { id: 5,  text: "I am an ambitious person, I set goals for myself",          type: "E" },
  { id: 6,  text: "I like to organize things (files, desks/offices)",          type: "C" },
  { id: 7,  text: "I like to build things",                                    type: "R" },
  { id: 8,  text: "I like to read about art and music",                        type: "A" },
  { id: 9,  text: "I like to have clear instructions to follow",               type: "C" },
  { id: 10, text: "I like to try to influence or persuade people",             type: "E" },
  { id: 11, text: "I like to do experiments",                                  type: "I" },
  { id: 12, text: "I like to teach or train people",                           type: "S" },
  { id: 13, text: "I like trying to help people solve their problems",         type: "S" },
  { id: 14, text: "I like to take care of animals",                            type: "R" },
  { id: 15, text: "I wouldn't mind working 8 hours per day in an office",      type: "C" },
  { id: 16, text: "I like selling things",                                     type: "E" },
  { id: 17, text: "I enjoy creative writing",                                  type: "A" },
  { id: 18, text: "I enjoy science",                                           type: "I" },
  { id: 19, text: "I am quick to take on new responsibilities",                type: "E" },
  { id: 20, text: "I am interested in healing people",                         type: "S" },
  { id: 21, text: "I enjoy trying to figure out how things work",              type: "I" },
  { id: 22, text: "I like putting things together or assembling things",       type: "R" },
  { id: 23, text: "I am a creative person",                                    type: "A" },
  { id: 24, text: "I pay attention to details",                                type: "C" },
  { id: 25, text: "I like to do filing or typing",                             type: "C" },
  { id: 26, text: "I like to analyze things (problems/situations)",            type: "I" },
  { id: 27, text: "I like to play instruments or sing",                        type: "A" },
  { id: 28, text: "I enjoy learning about other cultures",                     type: "S" },
  { id: 29, text: "I would like to start my own business",                     type: "E" },
  { id: 30, text: "I like to cook",                                            type: "R" },
  { id: 31, text: "I like acting in plays",                                    type: "A" },
  { id: 32, text: "I am a practical person",                                   type: "R" },
  { id: 33, text: "I like working with numbers or charts",                     type: "I" },
  { id: 34, text: "I like to get into discussions about issues",               type: "S" },
  { id: 35, text: "I am good at keeping records of my work",                   type: "C" },
  { id: 36, text: "I like to lead",                                            type: "E" },
  { id: 37, text: "I like working outdoors",                                   type: "R" },
  { id: 38, text: "I would like to work in an office",                         type: "C" },
  { id: 39, text: "I'm good at math",                                          type: "I" },
  { id: 40, text: "I like helping people",                                     type: "S" },
  { id: 41, text: "I like to draw",                                            type: "A" },
  { id: 42, text: "I like to give speeches",                                   type: "E" },
]

export const HOLLAND_TYPES: Record<HollandType, HollandTypeDefinition> = {
  R: {
    name: "Realistic",
    bracket: "Doers",
    likes: "You like work that involves designing, building, or repairing of equipment, materials, or structures, engaging in physical activity, or working outdoors.",
    thrives: "You will thrive in environments where hands-on problem solving is valued, where the results of your work are tangible and visible, and where you can engage directly with tools, materials, machines, or the natural world.",
  },
  I: {
    name: "Investigative",
    bracket: "Thinkers",
    likes: "You like work that involves studying and researching non-living objects, living organisms, disease or other forms of impairment, or human behavior.",
    thrives: "You will thrive in environments where curiosity is rewarded, where you are given the space to ask questions, analyse data, and develop evidence-based conclusions, and where intellectual rigour is the standard.",
  },
  A: {
    name: "Artistic",
    bracket: "Creators",
    likes: "You like work that involves creating original visual artwork, performances, written works, food, or music for a variety of media, or applying artistic principles to the design of various objects and materials.",
    thrives: "You will thrive in environments where creative freedom is respected, where original thinking is celebrated over conformity, and where your work has the opportunity to move, inspire, or provoke a response in others.",
  },
  S: {
    name: "Social",
    bracket: "Helpers",
    likes: "You like work that involves helping, teaching, advising, assisting, or providing service to others.",
    thrives: "You will thrive in environments where human connection is at the centre of the work, where your ability to listen, empathise, and support others is genuinely valued, and where you can see the direct impact of your efforts on the people around you.",
  },
  E: {
    name: "Enterprising",
    bracket: "Persuaders",
    likes: "You like work that involves managing, negotiating, marketing, or selling, typically in a business setting, or leading or advising people in political and legal situations.",
    thrives: "You will thrive in environments where ambition is rewarded, where you have the opportunity to lead, influence, and drive outcomes, and where the stakes are high enough to keep you genuinely engaged.",
  },
  C: {
    name: "Conventional",
    bracket: "Organizers",
    likes: "You like work that involves following procedures and regulations to organize information or data, typically in a business setting.",
    thrives: "You will thrive in environments where structure and precision are valued, where clear processes and systems exist to guide your work, and where your ability to maintain order, accuracy, and consistency makes a measurable difference.",
  },
}
