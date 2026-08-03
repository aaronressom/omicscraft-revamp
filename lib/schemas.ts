import { z } from "zod";

/**
 * Contact form schema.
 *
 * Imported by BOTH the client form and the route handler. Client-side
 * validation is a convenience for the user; the server re-runs this exact
 * schema because anything can POST to the endpoint directly.
 */
export const contactSchema = z.object({
  // The message on `z.string()` itself matters: without it, a missing field
  // falls through to Zod's internal wording ("expected string, received
  // undefined"), which would be shown to a real user.
  name: z
    .string("Please enter your name.")
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Name must be under 100 characters."),
  email: z
    .email("Please enter a valid email address.")
    .max(254, "Email must be under 254 characters."),
  subject: z
    .string("Please enter a valid subject.")
    .trim()
    .max(150, "Subject must be under 150 characters.")
    .optional(),
  message: z
    .string("Please enter a message.")
    .trim()
    .min(10, "Please include at least a sentence or two.")
    .max(5000, "Message must be under 5000 characters."),
  /**
   * Honeypot. Hidden from humans via CSS and aria-hidden, so a real user can
   * never fill it; automated form-fillers routinely do.
   *
   * Deliberately NOT constrained to empty here. If the schema rejected a
   * filled honeypot, the response would be a 400 naming `website` - which
   * tells a bot precisely which field to leave alone next time. Emptiness is
   * checked in the route instead, which accepts silently.
   */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Discriminated response so the client can render error states precisely. */
export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
