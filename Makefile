# Produce PDFs from all Markdown files in a directory
# Lincoln Mullen | http://lincolnmullen.com | lincoln@lincolnmullen.com

# List files to be made by finding all *.markdown files and appending .pdf
PDFS := $(patsubst %.markdown,%.markdown.pdf,$(wildcard *.markdown))
DOCX := $(patsubst %.markdown,%.markdown.docx,$(wildcard *.markdown))
TEX := $(patsubst %.markdown,%.markdown.tex,$(wildcard *.markdown))

# The all rule makes all the PDF files listed
all : $(PDFS) $(DOCX) $(TEX)

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

# This generic rule accepts docx targets with corresponding Markdown 
# source, and makes them using pandoc
%.markdown.tex : %.markdown
	pandoc -s $< -o $@

# Remove all outputs
clean :
	rm $(PDFS) $(DOCX) $(TEX)

# Remove all PDF outputs then build them again
rebuild : clean all
