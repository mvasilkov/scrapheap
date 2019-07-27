using System;
using System.Text;

namespace StringIntern2
{
    class MainClass
    {
        public static void Main(string[] args)
        {
            String a = "Hope is the first step on the road to disappointment.";
            String b = "Hope is the first step on the road to disappointment.";

            Console.WriteLine(string.Format("Strings are equal: {0}",
                a == b));
            Console.WriteLine(string.Format("Pointers are equal: {0}",
                (Object)a == (Object)b));

            String sb = new StringBuilder("Hope is the first step")
                .Append(" on the road to disappointment.").ToString();

            Console.WriteLine(string.Format("Strings are equal: {0}",
                a == sb));
            Console.WriteLine(string.Format("Pointers are equal: {0}",
                (Object)a == (Object)sb));
        }
    }
}
