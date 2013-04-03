# Produce PDFs from all Markdown files in a directory

# List files to be made by finding all *.md files and appending .pdf
PDFS := $(patsubst %.md,%.md.pdf,$(wildcard *.md))
DOCX := $(patsubst %.md,%.md.docx,$(wildcard *.md))
TEX := $(patsubst %.md,%.md.tex,$(wildcard *.md))

# The all rule makes all the PDF files listed
all : $(PDFS) $(DOCX) $(TEX)

# makes all Markdown into PDFs
pdf : $(PDFS)

# makes all Markdown into docx
docx : $(DOCX)

# makes all Markdown into tex
tex : $(TEX)

# This generic rule accepts PDF targets with corresponding Markdown 
# source, and makes them using pandoc
%.md.pdf : %.md
	pandoc $< -o $@ -N --toc

# This generic rule accepts docx targets with corresponding Markdown 
# source, and makes them using pandoc
%.md.docx : %.md
	pandoc $< -o $@ -N --toc

# This generic rule accepts docx targets with corresponding Markdown 
# source, and makes them using pandoc
%.md.tex : %.md
	pandoc -s $< -o $@ -N --toc

# Remove all outputs
clean :
	rm $(PDFS) $(DOCX) $(TEX)

# Remove all PDF outputs then build them again
rebuild : clean all
