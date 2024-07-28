import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-muted-dark p-6 md:py-12 w-full flex justify-center">
      <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm text-primary-foreground-dark">
        <div className="grid gap-1">
          <h3 className="font-semibold">Company</h3>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            About Us
          </Link>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Our Team
          </Link>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Careers
          </Link>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            News
          </Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Products</h3>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Men
          </Link>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Women
          </Link>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Kids
          </Link>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Accessories
          </Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Resources</h3>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Blog
          </Link>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Community
          </Link>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Support
          </Link>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            FAQs
          </Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Legal</h3>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Cookie Policy
          </Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Contact</h3>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Support
          </Link>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Sales
          </Link>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Press
          </Link>
          <Link
            href="#"
            className="hover:text-primary-foreground-dark"
            prefetch={false}
          >
            Partnerships
          </Link>
        </div>
      </div>
    </footer>
  );
}
