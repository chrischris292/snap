# Produce PDFs from all Markdown files in a directory
# Lincoln Mullen | http://lincolnmullen.com | lincoln@lincolnmullen.com

# List files to be made by finding all *.markdown files and appending .pdf
PDFS := $(patsubst %.markdown,%.markdown.pdf,$(wildcard *.markdown))
DOCX := $(patsubst %.markdown,%.markdown.docx,$(wildcard *.markdown))

# The all rule makes all the PDF files listed
all : $(PDFS) $(DOCX)

pdfs : $(PDFS)

docx : $(DOCX)

# This generic rule accepts PDF targets with corresponding Markdown 
# source, and makes them using pandoc
%.markdown.pdf : %.markdown
	pandoc $< -o $@

# This generic rule accepts docx targets with corresponding Markdown 
# source, and makes them using pandoc
%.markdown.docx : %.markdown
	pandoc $< -o $@

# Remove all PDF outputs
clean :
	rm $(PDFS)

# Remove all PDF outputs then build them again
rebuild : clean all
