﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Lucene.Net.Index;
using Lucene.Net.Search;

namespace StreamEnergy.LuceneServices.Web.Models
{
    public class AddressQueryParser
    {
        private readonly string field;
        private readonly Lucene.Net.Analysis.Analyzer analyzer;

        public AddressQueryParser(string field, Lucene.Net.Analysis.Analyzer analyzer)
        {
            this.field = field;
            this.analyzer = analyzer;
        }

        public Query Parse(string queryString)
        {
            // manually building it because the Query Parser treats "AND" and such oddly for a "typeahead"
            var tokens = new List<string>();
            using (var tokenStream = analyzer.TokenStream(field, new System.IO.StringReader(queryString)))
            {
                do
                {
                    var termAttr = tokenStream.GetAttribute<Lucene.Net.Analysis.Tokenattributes.ITermAttribute>();
                    if (termAttr.TermLength() > 0)
                    {
                        System.Diagnostics.Debug.WriteLine(termAttr.Term);
                        tokens.Add(termAttr.Term);
                    }
                } while (tokenStream.IncrementToken());
            }

            if (tokens.Count == 1)
            {
                return new TermQuery(new Term(field, tokens[0]));
            }
            else
            {
                var searchQueryBuilder = new BooleanQuery();
                for (var index = 0; index < tokens.Count; index++)
                {
                    var token = tokens[index];
                    if (IsNumeric(token))
                    {
                        if (index == tokens.Count - 1)
                        {
                            searchQueryBuilder.Add(new BooleanClause(new TermQuery(new Term(field, token)), Occur.SHOULD));
                        }
                        else
                        {
                            searchQueryBuilder.Add(new BooleanClause(new TermQuery(new Term(field, token)), Occur.MUST));
                        }
                    }
                    else
                    {
                        string altToken = token;
                        switch (token.ToLower())
                        {
                            case "north":
                                altToken = "n";
                                break;
                            case "south":
                                altToken = "s";
                                break;
                            case "east":
                                altToken = "e";
                                break;
                            case "west":
                                altToken = "w";
                                break;
                            case "northwest":
                                altToken = "nw";
                                break;
                            case "southwest":
                                altToken = "sw";
                                break;
                            case "northeast":
                                altToken = "ne";
                                break;
                            case "southeast":
                                altToken = "se";
                                break;
                            default:
                                break;
                        }
                        if (altToken != token.ToLower())
                        {
                            searchQueryBuilder.Add(new BooleanClause(new FuzzyQuery(new Term(field, altToken), 0.6f, 0), Occur.SHOULD));
                        }
                        searchQueryBuilder.Add(new BooleanClause(new FuzzyQuery(new Term(field, token), 0.6f, 1), Occur.SHOULD));
                    }
                }
                return searchQueryBuilder;
            }
        }

        private static bool IsNumeric(string token)
        {
            return token.All(c => c >= '0' && c <= '9');
        }

    }
}